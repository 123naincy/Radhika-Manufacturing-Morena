import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Phone,
  Mail,
  Package,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import {
  getQuoteRequests,
  updateQuoteStatus,
  type QuoteRequest,
} from "../../services/api";

const QuoteRequests = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedQuote, setSelectedQuote] =
    useState<QuoteRequest | null>(null);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const loadQuotes = async () => {
    try {
      setLoading(true);

      const response = await getQuoteRequests();

      setQuotes(response.quotes || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load quote requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const filteredQuotes = useMemo(() => {
    let result = [...quotes];

    if (search.trim()) {
      const keyword = search
        .toLowerCase()
        .trim();

      result = result.filter((quote) => {
        return (
          quote.name
            ?.toLowerCase()
            .includes(keyword) ||
          quote.company
            ?.toLowerCase()
            .includes(keyword) ||
          quote.phone
            ?.toLowerCase()
            .includes(keyword) ||
          quote.email
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (quote) =>
          quote.status === statusFilter
      );
    }

    return result;
  }, [quotes, search, statusFilter]);

  const handleStatusChange = async (
    id: string,
    status: QuoteRequest["status"]
  ) => {
    try {
      setUpdatingStatus(true);

      await updateQuoteStatus(id, status);

      setQuotes((prev) =>
        prev.map((quote) =>
          quote._id === id
            ? { ...quote, status }
            : quote
        )
      );

      if (
        selectedQuote &&
        selectedQuote._id === id
      ) {
        setSelectedQuote({
          ...selectedQuote,
          status,
        });
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const pendingCount = quotes.filter(
    (q) => q.status === "pending"
  ).length;

  const contactedCount = quotes.filter(
    (q) => q.status === "contacted"
  ).length;

  const quotedCount = quotes.filter(
    (q) => q.status === "quoted"
  ).length;

  const completedCount = quotes.filter(
    (q) => q.status === "completed"
  ).length;

  return (
    <div className="quote-crm-page">

      {/* HEADER */}
      <div className="quote-crm-header">

        <div>
          <span className="admin-eyebrow">
            B2B SALES
          </span>

          <h1>Quote Requests</h1>

          <p>
            Manage customer enquiries and bulk
            quotation leads.
          </p>
        </div>

        <button
          className="quote-refresh-btn"
          onClick={loadQuotes}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>


      {/* STATS */}
      <div className="quote-crm-stats">

        <div className="quote-stat-card">
          <span>Total Leads</span>
          <strong>{quotes.length}</strong>
        </div>

        <div className="quote-stat-card pending">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="quote-stat-card contacted">
          <span>Contacted</span>
          <strong>{contactedCount}</strong>
        </div>

        <div className="quote-stat-card quoted">
          <span>Quoted</span>
          <strong>{quotedCount}</strong>
        </div>

        <div className="quote-stat-card completed">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>

      </div>


      {/* FILTERS */}
      <div className="quote-crm-filters">

        <div className="quote-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search name, company, phone or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="quote-status-filter"
        >
          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="contacted">
            Contacted
          </option>

          <option value="quoted">
            Quoted
          </option>

          <option value="completed">
            Completed
          </option>
        </select>

      </div>


      {/* TABLE */}
      <div className="quote-crm-table-wrapper">

        {loading ? (
          <div className="quote-crm-empty">
            <RefreshCw
              size={30}
              className="spin"
            />

            <p>Loading quote requests...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="quote-crm-empty">

            <MessageSquare size={40} />

            <h3>
              No quote requests found
            </h3>

            <p>
              Try changing your search or status
              filter.
            </p>

          </div>
        ) : (
          <table className="quote-crm-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Requirement</th>
                <th>Value</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {filteredQuotes.map((quote) => (
                <tr key={quote._id}>

                  {/* CUSTOMER */}
                  <td>
                    <div className="quote-customer">

                      <div className="quote-avatar">
                        {quote.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {quote.name}
                        </strong>

                        {quote.company && (
                          <span>
                            {quote.company}
                          </span>
                        )}
                      </div>

                    </div>
                  </td>


                  {/* CONTACT */}
                  <td>
                    <div className="quote-contact">

                      <a
                        href={`tel:${quote.phone}`}
                      >
                        <Phone size={13} />
                        {quote.phone}
                      </a>

                      <a
                        href={`mailto:${quote.email}`}
                      >
                        <Mail size={13} />
                        {quote.email}
                      </a>

                    </div>
                  </td>


                  {/* REQUIREMENT */}
                  <td>
                    <div className="quote-requirement">

                      <strong>
                        {quote.enquiryType &&
                        quote.enquiryType !== "cart"
                          ? quote.enquiryType
                          : `${quote.products?.length || 0} product${
                              quote.products?.length === 1
                                ? ""
                                : "s"
                            }`}
                      </strong>

                      <span>
                        {quote.totalUnits}
                        {" "}units
                      </span>

                    </div>
                  </td>


                  {/* VALUE */}
                  <td>
                    <strong className="quote-value">
                      ₹
                      {quote.estimatedTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </td>


                  {/* STATUS */}
                  <td>
                    <select
                      className={`crm-status-select status-${quote.status}`}
                      value={quote.status}
                      disabled={updatingStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          quote._id,
                          e.target
                            .value as QuoteRequest["status"]
                        )
                      }
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="contacted">
                        Contacted
                      </option>

                      <option value="quoted">
                        Quoted
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </td>


                  {/* DATE */}
                  <td>
                    <span className="quote-date">
                      {new Date(
                        quote.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </td>


                  {/* VIEW */}
                  <td>
                    <button
                      className="quote-view-btn"
                      onClick={() =>
                        setSelectedQuote(
                          quote
                        )
                      }
                      title="View Quote"
                    >
                      <Eye size={17} />
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>


      {/* DETAILS DRAWER */}
      {selectedQuote && (
        <div
          className="quote-details-overlay"
          onClick={() =>
            setSelectedQuote(null)
          }
        >

          <aside
            className="quote-details-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* DRAWER HEADER */}
            <div className="quote-drawer-header">

              <div>
                <span>
                  QUOTE REQUEST
                </span>

                <h2>
                  {selectedQuote.name}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedQuote(null)
                }
                className="quote-drawer-close"
              >
                <X size={20} />
              </button>

            </div>


            {/* STATUS */}
            <div className="quote-drawer-status">

              <label>
                Lead Status
              </label>

              <select
                className={`crm-status-select status-${selectedQuote.status}`}
                value={selectedQuote.status}
                disabled={updatingStatus}
                onChange={(e) =>
                  handleStatusChange(
                    selectedQuote._id,
                    e.target
                      .value as QuoteRequest["status"]
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="contacted">
                  Contacted
                </option>

                <option value="quoted">
                  Quoted
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

            </div>


            {/* CUSTOMER */}
            <div className="quote-drawer-section">

              <h3>
                Customer Information
              </h3>

              <div className="customer-info-grid">

                <div>
                  <span>Name</span>
                  <strong>
                    {selectedQuote.name}
                  </strong>
                </div>

                {selectedQuote.company && (
                  <div>
                    <span>
                      Company
                    </span>

                    <strong>
                      {selectedQuote.company}
                    </strong>
                  </div>
                )}

                <div>
                  <span>Phone</span>

                  <a
                    href={`tel:${selectedQuote.phone}`}
                  >
                    <Phone size={14} />
                    {selectedQuote.phone}
                  </a>
                </div>

                <div>
                  <span>Email</span>

                  <a
                    href={`mailto:${selectedQuote.email}`}
                  >
                    <Mail size={14} />
                    {selectedQuote.email}
                  </a>
                </div>

                {selectedQuote.gstNumber && (
                  <div>
                    <span>GST Number</span>

                    <strong>
                      {selectedQuote.gstNumber}
                    </strong>
                  </div>
                )}

                {selectedQuote.city && (
                  <div>
                    <span>City</span>

                    <strong>
                      {selectedQuote.city}
                    </strong>
                  </div>
                )}

              </div>

            </div>


            {/* PRODUCTS */}
            <div className="quote-drawer-section">

              <h3>
                <Package size={17} />
                Requested Products
              </h3>

              <div className="drawer-products">

                {selectedQuote.products.map(
                  (item, index) => (
                    <div
                      className="drawer-product"
                      key={index}
                    >

                      <div>
                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          {item.quantity}
                          {" × ₹"}
                          {item.unitPrice}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {item.totalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* TOTAL */}
            <div className="drawer-total">

              <div>
                <span>
                  Total Units
                </span>

                <strong>
                  {selectedQuote.totalUnits}
                </strong>
              </div>

              <div>
                <span>
                  Estimated Value
                </span>

                <strong>
                  ₹
                  {selectedQuote.estimatedTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

            </div>


            {/* MESSAGE */}
            {selectedQuote.message && (
              <div className="quote-drawer-section">

                <h3>
                  <MessageSquare size={17} />
                  Customer Requirement
                </h3>

                <div className="customer-message">
                  {selectedQuote.message}
                </div>

              </div>
            )}


            {/* META */}
            <div className="quote-meta">

              <div>
                <CalendarDays size={15} />

                <span>
                  Requested on{" "}
                  {new Date(
                    selectedQuote.createdAt
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

            </div>


            {/* ACTIONS */}
            <div className="quote-drawer-actions">

              <a
                href={`tel:${selectedQuote.phone}`}
                className="drawer-call-btn"
              >
                <Phone size={17} />
                Call Customer
              </a>

              <a
                href={`mailto:${selectedQuote.email}`}
                className="drawer-email-btn"
              >
                <Mail size={17} />
                Email Customer
              </a>

            </div>

          </aside>

        </div>
      )}

    </div>
  );
};

export default QuoteRequests;