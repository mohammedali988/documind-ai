"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, ShieldAlert } from "lucide-react";
import { UserRole } from "../../types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: UserRole) => void;
}

export function InviteUserModal({
  isOpen,
  onClose,
  onInvite,
}: InviteUserModalProps): React.JSX.Element | null {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [error, setError] = useState("");

  // Reset form states when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setRole("viewer");
      setError("");
    }
  }, [isOpen]);

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    onInvite(trimmedEmail, role);
    onClose();
  };

  return (
    <div
      id="invite-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="invite-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        aria-describedby="invite-modal-description"
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          id="invite-modal-header"
          className="flex items-center justify-between px-6 py-5 border-b border-gray-100"
        >
          <div>
            <h2
              id="invite-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              Invite Team Member
            </h2>
            <p
              id="invite-modal-description"
              className="text-xs text-gray-500 mt-1"
            >
              Send an invitation to join your workspace
            </p>
          </div>
          <Button
            id="btn-close-invite-modal"
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full h-8 w-8 p-0 flex items-center justify-center"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form id="invite-member-form" onSubmit={handleSubmit}>
          <div id="invite-modal-body" className="p-6 space-y-4">
            {/* Email Field */}
            <div id="form-field-email" className="space-y-1.5">
              <label
                htmlFor="invite-email"
                className="text-xs font-semibold text-gray-700 block"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="michele@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className="pl-9 h-10 w-full"
                  autoFocus
                />
              </div>
              {error && (
                <p
                  id="invite-email-error"
                  className="flex items-center gap-1.5 text-xs text-red-600 font-medium"
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            {/* Role Field */}
            <div id="form-field-role" className="space-y-1.5">
              <label
                htmlFor="invite-role"
                className="text-xs font-semibold text-gray-700 block"
              >
                Role
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="block w-full h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 cursor-pointer transition-colors"
              >
                <option value="viewer">
                  Viewer - Read-only access to workspaces and documents
                </option>
                <option value="manager">
                  Manager - Can view and upload, but not edit settings
                </option>
                <option value="admin">
                  Admin - Full configuration and user access control
                </option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            id="invite-modal-footer"
            className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100"
          >
            <Button
              id="btn-cancel-invite"
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              id="btn-submit-invite"
              type="submit"
              variant="default"
              size="sm"
              className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
