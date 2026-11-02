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

function FavouriteDesignButton({ designId, title, isFavourite = false }) {
  const { isLoggedIn, role, profile } = useAuth();
  const userId = profile?.id;
  const [saved, setSaved] = useState(isFavourite);
  const [saving, setSaving] = useState(false);
  const requestRef = useRef(null);
  const buttonClassName = "absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-sm transition-colors hover:bg-rose-50 disabled:cursor-default";

  useEffect(() => {
    setSaved(isFavourite);
    setSaving(false);
    return () => {
      if (requestRef.current) requestRef.current.cancelled = true;
      requestRef.current = null;
    };
  }, [designId, userId, role, isLoggedIn, isFavourite]);

  const addFavourite = async () => {
    if (!isLoggedIn || role !== 4 || !userId || saved || requestRef.current) return;
    const request = { cancelled: false };
    requestRef.current = request;
    setSaving(true);
    try {
      await API.create_favourite(designId, userId);
      if (request.cancelled) return;
      setSaved(true);
      toast.success("Design added to favourites.", { autoClose: 5000 });
    } catch (error) {
      if (!request.cancelled) toast.error(getDesignError(error, "Unable to add this design to favourites. Please try again."), { autoClose: 5000 });
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

  const label = saved ? `${title} added to favourites` : saving ? `Saving ${title} to favourites` : `Add ${title} to favourites`;
  return (
    <button type="button" onClick={addFavourite} disabled={saving || saved || !userId} aria-label={label} title={saved ? "Added to favourites" : "Add to favourites"} aria-pressed={saved} aria-busy={saving} className={`${buttonClassName} ${saved ? "text-rose-600" : "text-ink/70 hover:text-rose-600"}`}>
      {saving ? <LoaderCircle size={21} aria-hidden="true" className="animate-spin" /> : <Heart size={21} aria-hidden="true" fill={saved ? "currentColor" : "none"} />}
    </button>
  );
}

export default FavouriteDesignButton;
