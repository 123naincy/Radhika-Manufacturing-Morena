import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ImagePlus,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  getProducts,
  deleteProduct,
  getCategories,
  createProduct,
  updateProduct,
} from "../../services/api";

import type { Product } from "../../types/product";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface BulkTier {
  minQuantity: string;
  maxQuantity: string;
  price: string;
}

interface ProductForm {
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string;
  brand: string;
  images: string[];
  basePrice: string;
  moq: string;
  unit: string;
  stock: string;
  bulkPricing: BulkTier[];
}

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  category: "",
  brand: "",
  images: [],
  basePrice: "",
  moq: "",
  unit: "piece",
  stock: "",
  bulkPricing: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      setProducts(response.products || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(
        (response.categories || []).filter(
          (category) => category.isActive
        )
      );
    } catch (error) {
      console.error(error);
      alert("Unable to load categories");
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleChange = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addBulkTier = () => {
    setForm((prev) => ({
      ...prev,
      bulkPricing: [
        ...prev.bulkPricing,
        {
          minQuantity: "",
          maxQuantity: "",
          price: "",
        },
      ],
    }));
  };

  const removeBulkTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateBulkTier = (
    index: number,
    field: keyof BulkTier,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.bulkPricing];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        bulkPricing: updated,
      };
    });
  };
  const uploadImageToCloudinary = async (
    file: File
  ) => {
    try {
      setUploadingImage(true);

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary configuration is missing."
        );
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        uploadPreset
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
          "Image upload failed"
        );
      }

      const imageUrl = data.secure_url;

      setForm((prev) => ({
        ...prev,
        images: imageUrl ? [imageUrl] : [],
      }));

      setImagePreview(imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image"
      );

      return "";
    } finally {
      setUploadingImage(false);
    }
  };
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    // Only image files
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // Local preview immediately
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    await uploadImageToCloudinary(file);

    URL.revokeObjectURL(previewUrl);
  };
  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!form.sku.trim()) {
      alert("SKU is required");
      return;
    }

    if (!form.category) {
      alert("Please select a category");
      return;
    }

    if (!form.basePrice || Number(form.basePrice) <= 0) {
      alert("Please enter a valid base price");
      return;
    }

    if (!form.moq || Number(form.moq) <= 0) {
      alert("Please enter a valid MOQ");
      return;
    }

    try {
      setSaving(true);

      const bulkPricing = form.bulkPricing.map((tier) => {
        const item: {
          minQuantity: number;
          maxQuantity?: number;
          price: number;
        } = {
          minQuantity: Number(tier.minQuantity),
          price: Number(tier.price),
        };

        if (tier.maxQuantity.trim()) {
          item.maxQuantity = Number(tier.maxQuantity);
        }

        return item;
      });

      const productData = {
        name: form.name.trim(),
        slug: form.slug.trim() || generateSlug(form.name),
        sku: form.sku.trim(),
        description: form.description.trim(),
        category: form.category,
        brand: form.brand.trim(),
        images: form.images.filter(Boolean),
        basePrice: Number(form.basePrice),
        moq: Number(form.moq),
        unit: form.unit,
        stock: Number(form.stock || 0),
        bulkPricing,
        isActive: true,
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct._id,
          productData
        );

        alert("Product updated successfully!");
      } else {
        await createProduct(productData);

        alert("Product added successfully!");
      }

      setForm(emptyForm);
      setEditingProduct(null);
      setShowForm(false);

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      await loadProducts();

      alert("Product deleted successfully");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      );
    }
  };

  const closeForm = () => {
  if (saving || uploadingImage) return;

  setShowForm(false);
  setForm(emptyForm);
  setEditingProduct(null);
  setImagePreview("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};
  return (
    <div className="admin-products-page">

      {/* HEADER */}
      <div className="admin-products-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage your stationery products, pricing and stock.
          </p>
        </div>

        <div className="admin-products-header-actions">
          <button
            className="admin-refresh-btn"
            onClick={loadProducts}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="admin-add-product-btn"
           onClick={() => {
  setEditingProduct(null);
  setForm(emptyForm);
  setImagePreview("");
  setShowForm(true);
            }}
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-products-table-wrapper">
        {loading ? (
          <div className="admin-products-loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="admin-products-empty">
            <Package size={45} />

            <h3>No products found</h3>

            <p>
              Start by adding your first product.
            </p>

            <button
              className="admin-add-product-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>MOQ</th>
                <th>Stock</th>
                <th>Bulk Tiers</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const image =
                  product.images &&
                    product.images.length > 0
                    ? product.images[0]
                    : "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=300";

                const categoryName =
                  typeof product.category === "object"
                    ? product.category.name
                    : "Stationery";

                return (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-name">
                        <img
                          src={image}
                          alt={product.name}
                        />

                        <div>
                          <strong>{product.name}</strong>

                          {product.brand && (
                            <span>
                              {product.brand}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{product.sku}</td>

                    <td>{categoryName}</td>

                    <td>
                      <strong>
                        ₹{product.basePrice}
                      </strong>
                      <small>
                        / {product.unit}
                      </small>
                    </td>

                    <td>{product.moq}</td>

                    <td>
                      <span
                        className={
                          product.stock > 0
                            ? "stock-badge stock-in"
                            : "stock-badge stock-out"
                        }
                      >
                        {product.stock > 0
                          ? `${product.stock} Available`
                          : "Out of Stock"}
                      </span>
                    </td>

                    <td>
                      <span className="bulk-badge">
                        {product.bulkPricing?.length || 0}
                        {" "}tiers
                      </span>
                    </td>

                    <td>
                      <div className="admin-product-actions">

                        <button
                          className="admin-edit-btn"
                          title="Edit Product"
                          onClick={() => {
                            setEditingProduct(product);

                            setForm({
                              name: product.name || "",
                              slug: product.slug || "",
                              sku: product.sku || "",
                              description: product.description || "",
                              category:
                                typeof product.category === "object"
                                  ? product.category._id
                                  : product.category || "",
                              brand: product.brand || "",
                              images: product.images || [],
                              basePrice: String(
                                product.basePrice ?? ""
                              ),
                              moq: String(product.moq ?? ""),
                              unit: product.unit || "piece",
                              stock: String(product.stock ?? ""),
                              bulkPricing:
                                product.bulkPricing?.map((tier) => ({
                                  minQuantity: String(
                                    tier.minQuantity
                                  ),
                                  maxQuantity:
                                    tier.maxQuantity !== undefined
                                      ? String(tier.maxQuantity)
                                      : "",
                                  price: String(tier.price),
                                })) || [],
                            });

                            setImagePreview(
                              product.images &&
                                product.images.length > 0
                                ? product.images[0]
                                : ""
                            );

                            setShowForm(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="admin-delete-btn"
                          title="Delete Product"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showForm && (
        <div className="product-modal-overlay">
          <div className="product-modal">

            <div className="product-modal-header">
              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product details and bulk pricing."
                    : "Add product details and bulk pricing."}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={22} />
              </button>
            </div>

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >

              {/* BASIC DETAILS */}
              <div className="form-section">
                <h3>Basic Information</h3>

                <div className="form-grid">

                  <div className="form-field form-field-full">
                    <label>
                      Product Name *
                    </label>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        handleNameChange(
                          e.target.value
                        )
                      }
                      placeholder="Radhika School Notebook"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Slug *</label>

                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        handleChange(
                          "slug",
                          e.target.value
                        )
                      }
                      placeholder="radhika-school-notebook"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>SKU *</label>

                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) =>
                        handleChange(
                          "sku",
                          e.target.value
                        )
                      }
                      placeholder="RAD-NB-001"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Category *</label>

                    <select
                      value={form.category}
                      onChange={(e) =>
                        handleChange(
                          "category",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">
                        Select Category
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Brand</label>

                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) =>
                        handleChange(
                          "brand",
                          e.target.value
                        )
                      }
                      placeholder="Radhika"
                    />
                  </div>

                  <div className="form-field form-field-full">
                    <label>Description</label>

                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        handleChange(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter product description..."
                      rows={4}
                    />
                  </div>

                  <div className="form-field form-field-full">

                    <label>Product Image</label>

                    <div className="product-image-upload">

                      {imagePreview || form.images[0] ? (
                        <div className="product-image-preview">

                          <img
                            src={
                              imagePreview ||
                              form.images[0]
                            }
                            alt="Product preview"
                          />

                          <button
                            type="button"
                            className="remove-product-image"
                            onClick={() => {
                              setImagePreview("");

                              setForm((prev) => ({
                                ...prev,
                                images: [],
                              }));

                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            disabled={uploadingImage}
                          >
                            <X size={17} />
                          </button>

                        </div>
                      ) : (
                        <div className="product-image-placeholder">

                          <ImagePlus size={38} />

                          <strong>
                            Upload Product Image
                          </strong>

                          <span>
                            JPG, PNG or WEBP · Max 5 MB
                          </span>

                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        hidden
                      />

                      <button
                        type="button"
                        className="product-image-upload-btn"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <>
                            <RefreshCw
                              size={17}
                              className="spin"
                            />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={17} />
                            {form.images[0]
                              ? "Change Image"
                              : "Choose Image"}
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </div>
              </div>

              {/* PRICING */}
              <div className="form-section">
                <h3>Pricing & Inventory</h3>

                <div className="form-grid">

                  <div className="form-field">
                    <label>Base Price (₹) *</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.basePrice}
                      onChange={(e) =>
                        handleChange(
                          "basePrice",
                          e.target.value
                        )
                      }
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>MOQ *</label>

                    <input
                      type="number"
                      min="1"
                      value={form.moq}
                      onChange={(e) =>
                        handleChange(
                          "moq",
                          e.target.value
                        )
                      }
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Unit *</label>

                    <select
                      value={form.unit}
                      onChange={(e) =>
                        handleChange(
                          "unit",
                          e.target.value
                        )
                      }
                    >
                      <option value="piece">
                        Piece
                      </option>

                      <option value="box">
                        Box
                      </option>

                      <option value="pack">
                        Pack
                      </option>

                      <option value="dozen">
                        Dozen
                      </option>

                      <option value="ream">
                        Ream
                      </option>

                      <option value="set">
                        Set
                      </option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Stock *</label>

                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) =>
                        handleChange(
                          "stock",
                          e.target.value
                        )
                      }
                      placeholder="5000"
                      required
                    />
                  </div>

                </div>
              </div>

              {/* BULK PRICING */}
              <div className="form-section">

                <div className="bulk-form-heading">
                  <div>
                    <h3>Bulk Pricing</h3>
                    <p>
                      Set different prices according
                      to quantity.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="add-tier-btn"
                    onClick={addBulkTier}
                  >
                    <Plus size={16} />
                    Add Tier
                  </button>
                </div>

                {form.bulkPricing.length === 0 ? (
                  <div className="no-tier-message">
                    No bulk pricing tiers added.
                  </div>
                ) : (
                  <div className="bulk-tier-list">

                    {form.bulkPricing.map(
                      (tier, index) => (
                        <div
                          className="bulk-tier-row"
                          key={index}
                        >
                          <div>
                            <label>
                              Minimum Qty
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                tier.minQuantity
                              }
                              onChange={(e) =>
                                updateBulkTier(
                                  index,
                                  "minQuantity",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div>
                            <label>
                              Maximum Qty
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                tier.maxQuantity
                              }
                              onChange={(e) =>
                                updateBulkTier(
                                  index,
                                  "maxQuantity",
                                  e.target.value
                                )
                              }
                              placeholder="Unlimited"
                            />
                          </div>

                          <div>
                            <label>
                              Price (₹)
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={tier.price}
                              onChange={(e) =>
                                updateBulkTier(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <button
                            type="button"
                            className="remove-tier-btn"
                            onClick={() =>
                              removeBulkTier(index)
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      )
                    )}

                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="product-form-footer">

                <button
                  type="button"
                  className="cancel-product-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />

                      {editingProduct
                        ? "Update Product"
                        : "Save Product"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;