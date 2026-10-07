import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] =
    useState<CategoryForm>(emptyForm);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error(error);

      alert("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const openAddForm = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      isActive: category.isActive,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: form.name.trim(),
        slug:
          form.slug.trim() ||
          generateSlug(form.name),
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (editingCategory) {
        await updateCategory(
          editingCategory._id,
          data
        );

        alert("Category updated successfully!");
      } else {
        await createCategory(data);

        alert("Category added successfully!");
      }

      closeForm();

      await loadCategories();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      await loadCategories();

      alert("Category deleted successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete category"
      );
    }
  };

  return (
    <div className="admin-categories-page">

      {/* HEADER */}
      <div className="admin-categories-header">
        <div>
          <h1>Categories</h1>

          <p>
            Manage product categories for your
            stationery store.
          </p>
        </div>

        <div className="category-header-actions">

          <button
            className="category-refresh-btn"
            onClick={loadCategories}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="category-add-btn"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Category
          </button>

        </div>
      </div>

      {/* CATEGORY TABLE */}
      <div className="categories-table-wrapper">

        {loading ? (
          <div className="categories-loading">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="categories-empty">

            <FolderOpen size={48} />

            <h3>No categories found</h3>

            <p>
              Add your first product category.
            </p>

            <button
              className="category-add-btn"
              onClick={openAddForm}
            >
              <Plus size={18} />
              Add Category
            </button>

          </div>
        ) : (
          <table className="categories-table">

            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>

                  <td>
                    <div className="category-name">
                      <div className="category-icon">
                        <FolderOpen size={18} />
                      </div>

                      <strong>
                        {category.name}
                      </strong>
                    </div>
                  </td>

                  <td>
                    <code>
                      {category.slug}
                    </code>
                  </td>

                  <td>
                    {category.description || "-"}
                  </td>

                  <td>
                    <span
                      className={
                        category.isActive
                          ? "category-status active"
                          : "category-status inactive"
                      }
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="category-actions">

                      <button
                        className="category-edit-btn"
                        title="Edit Category"
                        onClick={() =>
                          openEditForm(category)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="category-delete-btn"
                        title="Delete Category"
                        onClick={() =>
                          handleDelete(category._id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

      {/* MODAL */}
      {showForm && (
        <div className="category-modal-overlay">

          <div className="category-modal">

            <div className="category-modal-header">

              <div>
                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add New Category"}
                </h2>

                <p>
                  {editingCategory
                    ? "Update category details."
                    : "Create a new product category."}
                </p>
              </div>

              <button
                className="category-close-btn"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={21} />
              </button>

            </div>

            <form
              className="category-form"
              onSubmit={handleSubmit}
            >

              <div className="category-form-field">
                <label>
                  Category Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleNameChange(
                      e.target.value
                    )
                  }
                  placeholder="School Notebooks"
                  required
                />
              </div>

              <div className="category-form-field">
                <label>Slug *</label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  placeholder="school-notebooks"
                  required
                />
              </div>

              <div className="category-form-field">
                <label>Description</label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Notebooks and school copies..."
                  rows={4}
                />
              </div>

              <label className="category-active-toggle">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />

                <span>
                  Category is active
                </span>
              </label>

              <div className="category-form-footer">

                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="category-save-btn"
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

                      {editingCategory
                        ? "Update Category"
                        : "Save Category"}
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

export default Categories;