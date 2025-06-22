
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import type { UserProfile, ProfileUpdateRequest } from "@/services/api";

const ProfileForm = ({
  profile,
  onSubmit,
  onCancel,
  loading,
}: {
  profile: UserProfile | null;
  onSubmit: (data: ProfileUpdateRequest) => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const form = useForm<ProfileUpdateRequest>({
    defaultValues: {
      firstname: profile?.first_name || "",
      lastname: profile?.last_name || "",
      educational_level: profile?.educational_level || "",
      age: profile?.age,
    },
  });
  const handleSubmit = form.handleSubmit((data) => onSubmit(data));

  return (
    <form className="w-full mt-5 space-y-3 animate-fade-in" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs text-gray-500 block mb-1">First Name</label>
        <Input
          {...form.register("firstname")}
          defaultValue={profile?.first_name}
          disabled={loading}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Last Name</label>
        <Input
          {...form.register("lastname")}
          defaultValue={profile?.last_name}
          disabled={loading}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Education Level</label>
        <Input
          {...form.register("educational_level")}
          defaultValue={profile?.educational_level}
          disabled={loading}
          placeholder="e.g. University, High School"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Age</label>
        <Input
          {...form.register("age")}
          type="number"
          defaultValue={profile?.age}
          disabled={loading}
          min={1}
          max={120}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-2 pt-2">
        <Button
          type="submit"
          className="w-full bg-primary text-white hover:bg-primary/90"
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border border-gray-300"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
