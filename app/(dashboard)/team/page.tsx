"use client";

import React, { useState } from "react";
import { UserPlus, Users, Shield, Eye } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { TeamTable } from "../../../components/team/TeamTable";
import { InviteUserModal } from "../../../components/team/InviteUserModel";
import { UserRole } from "../../../types";
import { trpc } from "@/lib/trpc/client";

export default function TeamPage(): React.JSX.Element {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [errors, setErrors] = useState("");
  const utils = trpc.useUtils();

  const { data: me } = trpc.user.me.useQuery();
  const {
    data: members,
    isLoading,
    error,
  } = trpc.user.listTeamMembers.useQuery();

  const updateRoleMutation = trpc.user.updateRole.useMutation({
    onSuccess: () => utils.user.listTeamMembers.invalidate(),
  });

  const removeMemberMutation = trpc.user.removeMember.useMutation({
    onSuccess: () => utils.user.listTeamMembers.invalidate(),
  });

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleRemoveUser = (userId: string) => {
    removeMemberMutation.mutate({ userId });
  };

  const handleInvite = async (email: string, role: UserRole) => {
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.error || "Failed to send invite");
        return;
      }

      console.log("Invitation sent to:", email);
      // The invitee won't appear in the members list until they
      // accept the invite and log in for the first time.
    } catch (err) {
      console.log(err, "here is the error ");
      setErrors("Failed to send invite");
    }
  };

  const totalMembers = members?.length;
  const adminCount = members?.filter((u) => u.role === "admin").length;
  const viewerCount = members?.filter((u) => u.role === "viewer").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500 text-sm">
        Loading team...
      </div>
    );
  }

  return (
    <div id="team-workspace-page" className="space-y-8 animate-fade-in pb-12">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {errors}
        </div>
      )}

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
          users={members ?? []}
          currentUserId={me?.sub ?? ""}
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
