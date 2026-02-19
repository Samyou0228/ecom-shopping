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
      <h1 className="text-2xl font-bold">Admin Management</h1>

      <div className="flex gap-3 border-b pb-2">
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pendingAdmins.length})
        </Button>
        <Button
          variant={activeTab === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approvedAdmins.length})
        </Button>
        <Button
          variant={activeTab === "blocked" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("blocked")}
        >
          Blocked ({blockedAdmins.length})
        </Button>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : pendingAdmins.length === 0 ? (
            <p className="text-muted-foreground">No admin requests pending.</p>
          ) : (
            <div className="space-y-3">
              {pendingAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between border rounded-md px-4 py-2"
                >
                  <div>
                    <div className="font-semibold">{admin.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {admin.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => dispatch(declineAdmin(admin._id))}
                    >
                      Decline
                    </Button>
                    <Button onClick={() => dispatch(approveAdmin(admin._id))}>
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
        <div className="space-y-4">
          {approvedAdmins.length === 0 ? (
            <p className="text-muted-foreground">No approved admins.</p>
          ) : (
            <div className="space-y-3">
              {approvedAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between border rounded-md px-4 py-2"
                >
                  <div>
                    <div className="font-semibold">{admin.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {admin.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        dispatch(
                          admin.isBlocked
                            ? unblockAdmin(admin._id)
                            : blockAdmin(admin._id)
                        )
                      }
                    >
                      {admin.isBlocked ? "Unblock" : "Block"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => dispatch(deleteAdmin(admin._id))}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "blocked" && (
        <div className="space-y-4">
          {blockedAdmins.length === 0 ? (
            <p className="text-muted-foreground">No blocked admins.</p>
          ) : (
            <div className="space-y-3">
              {blockedAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between border rounded-md px-4 py-2"
                >
                  <div>
                    <div className="font-semibold">{admin.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {admin.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => dispatch(unblockAdmin(admin._id))}
                    >
                      Unblock
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => dispatch(deleteAdmin(admin._id))}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SuperAdminAdmins;
