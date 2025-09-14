import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader />
        {isSignUp ? (
          <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
        ) : (
          <SignIn onSwitchToSignUp={() => setIsSignUp(true)} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;