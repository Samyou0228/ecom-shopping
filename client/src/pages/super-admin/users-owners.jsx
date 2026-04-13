import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, fetchAllOwners } from "@/store/super-admin-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserCog, Mail, Phone, User as UserIcon, BadgeInfo } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function SuperAdminUsersOwners() {
  const dispatch = useDispatch();
  const { allUsers, allOwners, isLoading } = useSelector(
    (state) => state.superAdmin
  );
  const [view, setView] = useState("users");

  useEffect(() => {
    if (view === "users") {
      dispatch(fetchAllUsers());
    } else {
      dispatch(fetchAllOwners());
    }
  }, [dispatch, view]);

  const currentData = view === "users" ? allUsers : allOwners;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500">Manage site users and shop owners in a structured view</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">View:</span>
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200 shadow-sm rounded-xl">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="users">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Users</span>
                </div>
              </SelectItem>
              <SelectItem value="owners">
                <div className="flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-emerald-500" />
                  <span>Owners</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">No {view} found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Account State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                        view === 'users' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      }`}>
                        {item.userName?.charAt(0).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      {item.userName}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {item.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {item.phoneNumber || <span className="text-slate-400 italic text-xs">Not provided</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${
                        view === 'users' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                      }`}>
                        {view === 'users' ? 'User' : 'Owner'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminUsersOwners;
