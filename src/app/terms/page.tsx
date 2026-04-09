'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Scale, ShieldAlert, Globe, UserCheck, CreditCard, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-12 pt-4 md:pt-8">
      <header className="flex flex-col gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground">
          Last Updated: March 2024
        </p>
      </header>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Agreement to Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">
            By accessing and using NTET Prep Pro, you agree to be bound by these Terms and Conditions. These terms govern your use of our platform, including all study material, practice tests, and subscription services provided by SUGAM ವಿಜ್ಞಾನ.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Users must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              PRO Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            PRO subscriptions grant access to premium dossiers, smart practice tools, and mock tests for a specified duration. Subscriptions are tied to a single user account and cannot be shared.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            All content on NTET Prep Pro, including the "Theories, Persons & Events" dossier and high-yield notes, is the proprietary property of SUGAM ವಿಜ್ಞಾನ.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            While we strive for accuracy based on the NTET syllabus and PYQs, these materials are for preparation purposes only. We do not guarantee specific exam results.
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4 pt-4 border-t mt-4">
        <h2 className="text-2xl font-bold font-headline">Contact Information</h2>
        <p className="text-muted-foreground">
          For any legal inquiries regarding these terms, please reach out to us at <a href="mailto:sugamayurveda45@gmail.com" className="text-primary hover:underline inline-flex items-center gap-1"><Mail className="w-3 h-3" /> sugamayurveda45@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
