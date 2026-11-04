//libraries
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

//components
import { Heart, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

//utils
import getDesignError from "../../../../utils/getDesignError";

function FavouriteDesignButton({ designId, title, isFavourite = false, favouriteId, onFavouriteRemoved }) {
  const { isLoggedIn, role, profile } = useAuth();
  const userId = profile?.id;
  const [saved, setSaved] = useState(isFavourite);
  const [savedRecordId, setSavedRecordId] = useState(favouriteId || null);
  const [saving, setSaving] = useState(false);
  const requestRef = useRef(null);
  const buttonClassName = "absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-sm transition-colors hover:bg-rose-50 disabled:cursor-default";

  useEffect(() => {
    setSaved(isFavourite);
    setSavedRecordId(favouriteId || null);
    setSaving(false);
    return () => {
      if (requestRef.current) requestRef.current.cancelled = true;
      requestRef.current = null;
    };
  }, [designId, userId, role, isLoggedIn, isFavourite, favouriteId]);

  const toggleFavourite = async () => {
    if (!isLoggedIn || role !== 4 || !userId || requestRef.current) return;
    const request = { cancelled: false };
    requestRef.current = request;
    setSaving(true);
    try {
      if (saved) {
        let recordId = savedRecordId;
        if (!recordId) {
          const response = await API.get_user_favourites(userId);
          if (request.cancelled) return;
          recordId = response.data.find((item) => item.design_id === designId)?.id;
          if (!recordId) throw new Error("Unable to identify this favourite. Please refresh and try again.");
        }
        await API.delete_favourite(recordId);
        if (request.cancelled) return;
        setSaved(false);
        setSavedRecordId(null);
        toast.success("Design removed from favourites.", { autoClose: 5000 });
        onFavouriteRemoved?.(designId);
      } else {
        const response = await API.create_favourite(designId, userId);
        if (request.cancelled) return;
        const record = response.data?.favourite ?? response.data;
        setSavedRecordId(record?.design_id === designId && record?.user_id === userId ? record.id : null);
        setSaved(true);
        toast.success("Design added to favourites.", { autoClose: 5000 });
      }
    } catch (error) {
      if (!request.cancelled) toast.error(getDesignError(error, saved ? "Unable to remove this favourite. Please refresh and try again." : "Unable to add this design to favourites. Please try again."), { autoClose: 5000 });
    } finally {
      if (!request.cancelled) {
        requestRef.current = null;
        setSaving(false);
      }
    }
  };

  if (!isLoggedIn) return (
    <Link to="/auth/login" aria-label={`Log in to favourite ${title}`} title="Log in to save favourites" className={`${buttonClassName} text-ink/70`}>
      <Heart size={21} aria-hidden="true" />
    </Link>
  );
  if (role !== 4) return null;

  const label = saving ? `Updating favourite for ${title}` : saved ? `Remove ${title} from favourites` : `Add ${title} to favourites`;
  return (
    <button type="button" onClick={toggleFavourite} disabled={saving || !userId} aria-label={label} title={saved ? "Remove from favourites" : "Add to favourites"} aria-pressed={saved} aria-busy={saving} className={`${buttonClassName} ${saved ? "text-rose-600" : "text-ink/70 hover:text-rose-600"}`}>
      {saving ? <LoaderCircle size={21} aria-hidden="true" className="animate-spin" /> : <Heart size={21} aria-hidden="true" fill={saved ? "currentColor" : "none"} />}
    </button>
  );
}

export default FavouriteDesignButton;
