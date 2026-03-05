import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveAdmin,
  declineAdmin,
  fetchAllAdmins,
  fetchPendingAdmins,
  blockAdmin,
  unblockAdmin,
  deleteAdmin,
} from "@/store/super-admin-slice";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, ShieldBan, Trash2, Check, X } from "lucide-react";

function SuperAdminAdmins() {
  const dispatch = useDispatch();
  const { pendingAdmins, allAdmins, isLoading } = useSelector((state) => state.superAdmin);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    dispatch(fetchPendingAdmins());
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  const approvedAdmins = useMemo(
    () => allAdmins.filter((admin) => admin.isApproved),
    [allAdmins]
  );

  const blockedAdmins = useMemo(
    () => allAdmins.filter((admin) => admin.isBlocked),
    [allAdmins]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Admin Management</h1>
        <p className="text-slate-500">Manage and monitor all admin accounts</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "pending"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Pending ({pendingAdmins.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "approved"
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Approved ({approvedAdmins.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("blocked")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "blocked"
              ? "bg-white text-red-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldBan className="w-4 h-4" />
            Blocked ({blockedAdmins.length})
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {activeTab === "pending" && (
          <div className="p-6">
            {isLoading ? (
              <p className="text-slate-500">Loading...</p>
            ) : pendingAdmins.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No admin requests pending.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAdmins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {admin.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{admin.userName}</div>
                        <div className="text-sm text-slate-500">{admin.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => dispatch(declineAdmin(admin._id))}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => dispatch(approveAdmin(admin._id))}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div className="p-6">
            {approvedAdmins.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No approved admins.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedAdmins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                        {admin.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{admin.userName}</div>
                        <div className="text-sm text-slate-500">{admin.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-200 text-amber-600 hover:bg-amber-50"
                        onClick={() =>
                          dispatch(
                            admin.isBlocked
                              ? unblockAdmin(admin._id)
                              : blockAdmin(admin._id)
                          )
                        }
                      >
                        <ShieldBan className="w-4 h-4 mr-1" />
                        {admin.isBlocked ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => dispatch(deleteAdmin(admin._id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "blocked" && (
          <div className="p-6">
            {blockedAdmins.length === 0 ? (
              <div className="text-center py-12">
                <ShieldBan className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No blocked admins.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedAdmins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {admin.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{admin.userName}</div>
                        <div className="text-sm text-slate-500">{admin.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => dispatch(unblockAdmin(admin._id))}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Unblock
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => dispatch(deleteAdmin(admin._id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminAdmins;
