import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function SignUpBtn() {
  return (
    <div>
      <ClerkLoading>
        <div className="size-7.5 rounded-full bg-muted animate-pulse" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignUpButton>
            <Button
              variant="outline"
              className="rounded-xl shadow-sm tracking-wide"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="size-7.5">
            <UserButton />
          </div>
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}
