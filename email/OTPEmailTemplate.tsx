import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"
import type * as React from "react"

interface OTPEmailTemplateProps {
  otp: string
  recipientName: string
}

export const OTPEmailTemplate: React.FC<OTPEmailTemplateProps> = ({ otp, recipientName }) => (
  <Html>
    <Head />
    <Heading as="h2">Acedemix</Heading>
    <Preview>Your OTP for authentication</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>One-Time Password (OTP)</Heading>
        <Text style={text}>Hello {recipientName},</Text>
        <Text style={text}>Your One-Time Password (OTP) for authentication is:</Text>
        <Section style={otpContainer}>
          <Text style={otpText}>{otp}</Text>
        </Section>
        <Text style={text}>This OTP is valid for 10 minutes.</Text>
        <Text style={text}>If you didn't request this OTP, please ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)

export default OTPEmailTemplate

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "32px",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
}

const otpContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px 0",
  padding: "16px",
  textAlign: "center" as const,
}

const otpText = {
  color: "#000",
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "0",
}

