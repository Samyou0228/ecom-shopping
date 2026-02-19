import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveAdmin,
  declineAdmin,
  fetchPendingAdmins,
} from "@/store/super-admin-slice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function UnauthPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pendingAdmins } = useSelector((state) => state.superAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "superadmin") {
      dispatch(fetchPendingAdmins());
    }
  }, [dispatch, user]);

  if (user?.role === "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-xl space-y-6 border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Admin approvals</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth/login")}
            >
              Back
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            You tried to access a restricted page. You can manage pending admin
            registrations below instead.
          </p>
          {pendingAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No admin registrations waiting for approval.
            </p>
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
                    <Button
                      onClick={() => dispatch(approveAdmin(admin._id))}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>You don't have access to view this page</p>
    </div>
  );
}

export default UnauthPage;
