"use client";

import React, { useState } from "react";
import { UserPlus, Users, Shield, Eye } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { TeamTable } from "../../../components/team/TeamTable";
import { InviteUserModal } from "../../../components/team/InviteUserModel";
import { mockUsers, mockTenants } from "../../../lib/mockData";
import { User, UserRole } from "../../../types";

export default function TeamPage(): React.JSX.Element {
  const currentTenant = mockTenants[0]; // Smith & Partners
  const currentUser = mockUsers[0]; // Admin user

  // Initialize state with users filtered by the current tenant ID
  const tenantUsers = mockUsers.filter((u) => u.tenantId === currentTenant.id);
  const [users, setUsers] = useState<User[]>(tenantUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Handle changing user role
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );
    console.log(`Updated user ${userId} role to: ${newRole}`);
  };

  // Handle removing a user
  const handleRemoveUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    console.log(`Removed user with ID: ${userId}`);
  };

  // Handle inviting a new user
  const handleInvite = (email: string, role: UserRole) => {
    const nameFromEmail = email.split("@")[0];
    const capitalizedName =
      nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const newUser: User = {
      id: `user-simulated-${Date.now()}`,
      email: email,
      name: capitalizedName,
      role: role,
      tenantId: currentTenant.id,
      createdAt: new Date(),
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    console.log("Successfully invited team member:", { email, role });
  };

  // Stats calculation
  const totalMembers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;

  return (
    <div id="team-workspace-page" className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <PageHeader
        title="Team"
        description="Manage your workspace members"
        action={
          <Button
            id="btn-invite-team-member"
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </Button>
        }
      />

      {/* Stats row: 3 small cards */}
      <div
        id="team-stats-row"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Members */}
        <div
          id="stat-card-total"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4"
        >
          <div
            id="stat-icon-wrapper-total"
            className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"
          >
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Members
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {totalMembers}
            </h3>
          </div>
        </div>

        {/* Admins */}
        <div
          id="stat-card-admins"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4"
        >
          <div
            id="stat-icon-wrapper-admins"
            className="p-3 bg-red-50 text-red-600 rounded-lg"
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admins
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {adminCount}
            </h3>
          </div>
        </div>

        {/* Viewers */}
        <div
          id="stat-card-viewers"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4"
        >
          <div
            id="stat-icon-wrapper-viewers"
            className="p-3 bg-amber-50 text-amber-600 rounded-lg"
          >
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Viewers
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {viewerCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Team Table section */}
      <div id="team-table-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-950">Active Members</h3>
          <span className="text-xs text-gray-500 font-medium">
            Showing {totalMembers} member{totalMembers === 1 ? "" : "s"}
          </span>
        </div>
        <TeamTable
          users={users}
          currentUserId={currentUser.id}
          onChangeRole={handleChangeRole}
          onRemoveUser={handleRemoveUser}
        />
      </div>

      {/* Invite Member Modal */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
