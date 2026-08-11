import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const COMPANY = {
  name: "HONOR. W. LTD",
  brand: "HONOR",
  number: "17373245",
  address: "DEPT 6977, 196 High Road, Wood Green, London N22 8HH, England",
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#1c1a17",
};

const container = { padding: "32px 28px", maxWidth: "600px", margin: "0 auto" };
const brand = {
  fontSize: "13px",
  letterSpacing: "0.32em",
  textTransform: "uppercase" as const,
  color: "#9a7b45",
  margin: "0 0 24px",
};
const heading = { fontSize: "26px", fontWeight: 400 as const, margin: "0 0 16px" };
const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: "0 0 14px",
};
const footer = {
  fontSize: "11px",
  lineHeight: "18px",
  color: "#6b6560",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: "0",
};
const rule = { borderColor: "#e8e2d9", margin: "28px 0 18px" };

export const styles = { main, container, brand, heading, paragraph, footer, rule };

export function EmailShell({
  preview,
  title,
  children,
}: {
  preview: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>{COMPANY.brand} — Atelier de couture</Text>
          <Heading style={heading}>{title}</Heading>
          <Section>{children}</Section>
          <Hr style={rule} />
          <Text style={footer}>
            {COMPANY.name} — Company number {COMPANY.number}
            <br />
            {COMPANY.address}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
