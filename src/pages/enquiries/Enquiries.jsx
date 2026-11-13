import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import enquiryService from "../../services/enquiries/enquiryService";
import EnquiryTable from "../../components/enquiries/EnquiryTable";
import EnquiryViewModal from "../../components/enquiries/EnquiryViewModal";
import { SearchInput, Select, ConfirmDialog, Pagination } from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Closed", label: "Closed" },
];

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const { enquiries: data, pagination } = await enquiryService.getEnquiries({
        page,
        limit: 20,
        status,
      });
      setEnquiries(data);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || "Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Filtering by name/mobile is done client-side on the current page since
  // the list API doesn't take a search param — swap this for a server-side
  // `search` query param once the backend supports one.
  const filtered = debouncedSearch.trim()
    ? enquiries.filter((e) => {
        const q = debouncedSearch.trim().toLowerCase();
        return (
          e.fullName?.toLowerCase().includes(q) ||
          e.mobile?.includes(q) ||
          e.email?.toLowerCase().includes(q)
        );
      })
    : enquiries;

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await enquiryService.deleteEnquiry(toDelete.id);
      toast.success("Enquiry deleted");
      setToDelete(null);
      loadEnquiries();
    } catch (err) {
      toast.error(err.message || "Failed to delete enquiry.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          className="flex-1"
          value={search}
          onChange={setSearch}
          placeholder="Search by name, mobile or email"
        />
        <div className="shrink-0 sm:w-52">
          <Select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <EnquiryTable
        enquiries={filtered}
        loading={loading}
        onView={setViewing}
        onDelete={setToDelete}
      />

      <Pagination className="mt-5" page={page} totalPages={totalPages} onPageChange={setPage} />

      <EnquiryViewModal enquiry={viewing} onClose={() => setViewing(null)} />

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete enquiry"
        message={`Are you sure you want to delete the enquiry from ${toDelete?.fullName}? This cannot be undone.`}
      />
    </div>
  );
}