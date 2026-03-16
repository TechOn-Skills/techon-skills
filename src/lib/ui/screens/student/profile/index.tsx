"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@apollo/client/react"
import {
  AwardIcon,
  BriefcaseIcon,
  CalendarIcon,
  EditIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  TrophyIcon,
  UserIcon
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { Separator } from "@/lib/ui/useable-components/separator"
import { cn, formatDate } from "@/lib/helpers"
import { GET_USER_PROFILE_INFO } from "@/lib/graphql"
import { PhoneInput, getFullPhone, parsePhoneFromString } from "@/lib/ui/useable-components/phone-input"

type ProfileApi = { id: string; email: string; fullName?: string | null; phoneNumber?: string | null; profilePicture?: string | null; createdAt?: string }

export const StudentProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { data, loading, error } = useQuery<{ userProfileInfo: ProfileApi | null }>(GET_USER_PROFILE_INFO)
  const apiProfile = data?.userProfileInfo

  const hasSynced = useRef(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Lahore, Pakistan",
    bio: "Passionate about web development and creating impactful digital experiences. Currently learning full-stack development to build my dream career in tech.",
    github: "",
    linkedin: "",
    portfolio: "",
    enrolledDate: "—",
    currentCourse: "—",
  })

  useEffect(() => {
    if (!apiProfile || hasSynced.current) return
    hasSynced.current = true
    setProfile((prev) => ({
      ...prev,
      name: apiProfile.fullName ?? prev.name,
      email: apiProfile.email ?? prev.email,
      phone: apiProfile.phoneNumber ?? prev.phone,
      enrolledDate: apiProfile.createdAt ? formatDate(apiProfile.createdAt, { month: "long", year: "numeric", locale: "en-GB" }) : prev.enrolledDate,
    }))
  }, [apiProfile])

  const profilePhoneValue = parsePhoneFromString(profile.phone)

  // Calculate profile completion
  const profileCompletion = (() => {
    const fields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.location,
      profile.bio,
      profile.github,
      profile.linkedin,
      profile.portfolio,
    ]
    const filled = fields.filter(f => f && f.trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  })()

  if (loading) {
    return (
      <div className="w-full py-10 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" />
        <span>Loading profile...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="w-full py-10 text-center text-muted-foreground">
        <p className="text-destructive">Failed to load profile. Please try again.</p>
      </div>
    )
  }

  // Only show stats when we have real data from API (no such API yet – hide section)
  const stats: { label: string; value: string; icon: typeof BriefcaseIcon; percentage: number }[] = []

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-semibold text-secondary">Your Profile</div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Build your tech journey
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
              Your profile showcases your progress, achievements, and skills. Keep it updated to track your growth and share with potential employers.
            </p>
          </div>

          {/* Profile Completion */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
            <div className="bg-background/80 backdrop-blur rounded-3xl px-6 py-4">
              <div className="text-center">
                <div className="relative inline-block mb-2">
                  <svg className="size-20" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-background/40"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-(--brand-primary)"
                      strokeDasharray={`${profileCompletion * 2.51} 251`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{profileCompletion}%</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Profile Complete</div>
                {profileCompletion < 100 && (
                  <div className="text-xs text-(--brand-accent) mt-1">
                    {profileCompletion >= 80 ? "Almost there!" : "Keep going!"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:shadow-xl">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
              <div className="relative h-32 bg-[linear-gradient(135deg,rgba(70,208,255,0.4),rgba(255,138,61,0.3))]">
                <div className="absolute -bottom-16 left-6">
                  <div className="bg-background/90 backdrop-blur size-32 rounded-3xl border-4 border-background flex items-center justify-center shadow-xl">
                    <UserIcon className="size-16 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <CardHeader className="pt-20 pb-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {profile.currentCourse}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-(--brand-secondary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                        <SparklesIcon className="size-3.5" />
                        Active Learner
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={isEditing ? "brand-secondary" : "outline"}
                    shape="pill"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <EditIcon className="size-4" />
                    {isEditing ? "Save" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Bio Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-secondary">About Me</h3>
                  {isEditing ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="min-h-24"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm leading-7">{profile.bio}</p>
                  )}
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-secondary">Contact Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <MailIcon className="size-3.5" />
                        Email
                      </div>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <div className="font-semibold text-sm">{profile.email}</div>
                      )}
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <PhoneIcon className="size-3.5" />
                        Phone
                      </div>
                      {isEditing ? (
                        <div className="mt-1">
                          <PhoneInput
                            value={profilePhoneValue}
                            onChange={(v) => setProfile({ ...profile, phone: getFullPhone(v) })}
                            placeholder="Phone number"
                          />
                        </div>
                      ) : (
                        <div className="font-semibold text-sm">{profile.phone || "—"}</div>
                      )}
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <MapPinIcon className="size-3.5" />
                        Location
                      </div>
                      {isEditing ? (
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <div className="font-semibold text-sm">{profile.location}</div>
                      )}
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <CalendarIcon className="size-3.5" />
                        Enrolled Since
                      </div>
                      <div className="font-semibold text-sm">{profile.enrolledDate}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-secondary">Social Links</h3>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <GithubIcon className="size-3.5" />
                        GitHub
                      </div>
                      {isEditing ? (
                        <Input
                          value={profile.github}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          placeholder="username"
                          className="mt-1"
                        />
                      ) : (
                        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="font-semibold text-sm hover:text-(--brand-primary) transition-colors">
                          github.com/{profile.github}
                        </a>
                      )}
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <LinkedinIcon className="size-3.5" />
                        LinkedIn
                      </div>
                      {isEditing ? (
                        <Input
                          value={profile.linkedin}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          placeholder="username"
                          className="mt-1"
                        />
                      ) : (
                        <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer" className="font-semibold text-sm hover:text-(--brand-primary) transition-colors">
                          linkedin.com/in/{profile.linkedin}
                        </a>
                      )}
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <GlobeIcon className="size-3.5" />
                        Portfolio
                      </div>
                      {isEditing ? (
                        <Input
                          value={profile.portfolio}
                          onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                          placeholder="yourwebsite.com"
                          className="mt-1"
                        />
                      ) : (
                        <a href={`https://${profile.portfolio}`} target="_blank" rel="noreferrer" className="font-semibold text-sm hover:text-(--brand-primary) transition-colors">
                          {profile.portfolio}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section – only shown when we have data from API */}
          {stats.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.18),rgba(255,138,61,0.10),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">{stat.label}</div>
                          <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                        </div>
                        <div className="bg-(--brand-primary) text-(--text-on-dark) size-12 rounded-2xl flex items-center justify-center">
                          <stat.icon className="size-6" />
                        </div>
                      </div>
                      <div className="h-2 bg-background/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-(--brand-primary) to-(--brand-accent) transition-all duration-500"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Motivational Card */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-(--brand-accent)">
                  <SparklesIcon className="size-5" />
                  <span className="font-semibold text-sm">Keep Going!</span>
                </div>
                <p className="text-muted-foreground text-sm leading-7">
                  Every line of code you write, every assignment you complete, brings you closer to your dream career. Stay consistent, stay curious, and trust the process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
