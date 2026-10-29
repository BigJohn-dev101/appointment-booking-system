import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../../../services/api";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

type Service = {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", description: "", duration: 30, price: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Services
  const fetchServices = async () => {
    try {
      const data = await apiFetch<Service[]>("/provider/services");
      setServices(data);
    } catch (error) {
      console.error("Provider services fetch failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    void apiFetch<Service[]>("/provider/services")
      .then((data) => {
        if (isMounted) setServices(data);
      })
      .catch((error: unknown) => {
        console.error("Provider services fetch failed:", error);
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Failed to load services");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Form Submit
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch("/provider/services", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success("Service added successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", description: "", duration: 30, price: 0 }); // Reset form
      fetchServices(); // Refresh list
    } catch (error) {
      console.error("Provider service creation failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await apiFetch(`/provider/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      console.error("Provider service deletion failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete service");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Services</h1>
          <p className="text-slate-500 mt-1">Manage the services your customers can book.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:brightness-105"
          style={{ background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})` }}
        >
          <span>+</span> Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-4">
              <span className="text-xl">◈</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No services yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Add your first service to start accepting bookings from customers.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {services.map((service) => (
              <div key={service.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{service.description || "No description provided."}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-1">⏱ {service.duration} mins</span>
                    <span className="flex items-center gap-1">💵 ${service.price}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline w-fit"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Add New Service</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Haircut & Styling" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" rows={2} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (mins)</label>
                  <input required type="number" min="5" step="5" value={formData.duration} onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:brightness-105 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})` }}>
                  {isSubmitting ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}