import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Instagram } from "lucide-react";
interface InstagramFollowTutorialProps {
  open: boolean;
  onRemindLater: () => void;
  onNeverShow: () => void;
}
export function InstagramFollowTutorial({
  open,
  onRemindLater,
  onNeverShow
}: InstagramFollowTutorialProps) {
  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/_creator_dip_?igsh=MXJncXV0a2dzYjZuNg%3D%3D&utm_source=qr", "_blank");
  };
  return <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
            <Instagram className="h-6 w-6 text-pink-500" />
            Follow us on Instagram!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <div>
              <p className="text-sm mb-2">
                We post event updates and announcements!
              </p>
              <p className="text-sm text-gray-600 mb-4">
                イベントの連絡なども載せてるよ！インスタのフォローを忘れずに！
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-lg">
              <button onClick={handleInstagramClick} className="text-white font-bold text-xl hover:scale-105 transition-transform">
                @_creator_dip_
              </button>
              <p className="text-white text-sm mt-2">
                Click here to follow!
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2">
          <button onClick={onRemindLater} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors py-[4px] text-base">
            Remind me later
          </button>
          <AlertDialogCancel onClick={onNeverShow} className="w-full text-xs h-8 py-[2px]">
            Don't show again
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
}