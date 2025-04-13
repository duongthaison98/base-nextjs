"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { useLanguage } from "@/lib/i18n/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  const { isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Next.js App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              {t("common.home")}
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
              {t("common.dashboard")}
            </Link>
            <Link href="/table-example" className="transition-colors hover:text-foreground/80">
              {t("common.table")}
            </Link>
            <Link href="/form-example" className="transition-colors hover:text-foreground/80">
              {t("common.form")}
            </Link>
            <Link href="/realtime" className="transition-colors hover:text-foreground/80">
              Realtime
            </Link>
            <Link href="/redux-example" className="transition-colors hover:text-foreground/80">
              Redux
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <ModeToggle />
          {isAuthenticated ? (
            <Button variant="ghost" onClick={logout}>
              {t("auth.signOut")}
            </Button>
          ) : (
            <Link href="/login">{t("auth.signIn")}</Link>
          )}
        </div>
      </div>
    </header>
  )
}
