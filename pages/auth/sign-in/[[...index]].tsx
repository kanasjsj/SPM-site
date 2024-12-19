import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
}