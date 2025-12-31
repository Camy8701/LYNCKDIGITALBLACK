import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile, useUploadAvatar, useDeleteAvatar } from "@/hooks/useProfile";
import Button from "@/components/Button";
import { User, Upload, Trash2, Save } from "lucide-react";

const ProfileSettings = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    company: '',
    website: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    address_country: ''
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        company: profile.company || '',
        website: profile.website || '',
        address_street: profile.address_street || '',
        address_city: profile.address_city || '',
        address_state: profile.address_state || '',
        address_zip: profile.address_zip || '',
        address_country: profile.address_country || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      await uploadAvatar.mutateAsync(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleAvatarDelete = async () => {
    await deleteAvatar.mutateAsync();
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground/60 font-serif">Failed to load profile</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Avatar Section */}
      <div className="bg-vibrant-lavender rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans">
          Profile Picture
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Display */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
              {avatarPreview || profile.avatar_url ? (
                <img
                  src={avatarPreview || profile.avatar_url || ''}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-foreground/40" />
              )}
            </div>
          </div>

          {/* Avatar Actions */}
          <div className="flex-1 space-y-3">
            <div>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="filled"
                  className="text-sm py-2 px-4 flex items-center gap-2"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </Button>
              </label>
              <p className="text-xs text-foreground/60 mt-2 font-serif">
                JPEG, PNG, GIF or WebP. Max 5MB.
              </p>
            </div>

            {avatarPreview && (
              <Button
                type="button"
                variant="filled"
                className="text-sm py-2 px-4"
                onClick={handleAvatarUpload}
                disabled={uploadAvatar.isPending}
              >
                {uploadAvatar.isPending ? 'Uploading...' : 'Upload New Avatar'}
              </Button>
            )}

            {profile.avatar_url && !avatarPreview && (
              <Button
                type="button"
                variant="transparent"
                className="text-sm py-2 px-4 flex items-center gap-2"
                onClick={handleAvatarDelete}
                disabled={deleteAvatar.isPending}
              >
                <Trash2 className="w-4 h-4" />
                Remove Avatar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-vibrant-mint rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-bold uppercase mb-2 font-sans">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold uppercase mb-2 font-sans">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground/30 bg-foreground/5 font-serif text-foreground/50 cursor-not-allowed"
            />
            <p className="text-xs text-foreground/60 mt-1 font-serif">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold uppercase mb-2 font-sans">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-bold uppercase mb-2 font-sans">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="LYNCK Studio"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="website" className="block text-sm font-bold uppercase mb-2 font-sans">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="https://example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-bold uppercase mb-2 font-sans">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-vibrant-yellow rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans">
          Billing Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="address_street" className="block text-sm font-bold uppercase mb-2 font-sans">
              Street Address
            </label>
            <input
              id="address_street"
              name="address_street"
              type="text"
              value={formData.address_street}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label htmlFor="address_city" className="block text-sm font-bold uppercase mb-2 font-sans">
              City
            </label>
            <input
              id="address_city"
              name="address_city"
              type="text"
              value={formData.address_city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="San Francisco"
            />
          </div>

          <div>
            <label htmlFor="address_state" className="block text-sm font-bold uppercase mb-2 font-sans">
              State / Province
            </label>
            <input
              id="address_state"
              name="address_state"
              type="text"
              value={formData.address_state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="California"
            />
          </div>

          <div>
            <label htmlFor="address_zip" className="block text-sm font-bold uppercase mb-2 font-sans">
              ZIP / Postal Code
            </label>
            <input
              id="address_zip"
              name="address_zip"
              type="text"
              value={formData.address_zip}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="94102"
            />
          </div>

          <div>
            <label htmlFor="address_country" className="block text-sm font-bold uppercase mb-2 font-sans">
              Country
            </label>
            <input
              id="address_country"
              name="address_country"
              type="text"
              value={formData.address_country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-serif"
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="filled"
          className="text-base py-4 px-8 flex items-center gap-2"
          disabled={updateProfile.isPending}
        >
          <Save className="w-5 h-5" />
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettings;
