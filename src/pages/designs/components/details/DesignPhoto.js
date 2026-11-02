//libraries
import { useState } from "react";

//components
import { ImageOff } from "lucide-react";

function DesignPhoto({ image, alt, className, loading = "lazy" }) {
  const [failed, setFailed] = useState(false);
  return image?.url && !failed ? (
    <img src={image.url} alt={alt} loading={loading} onError={() => setFailed(true)} className={className} />
  ) : (
    <span className={`flex items-center justify-center bg-sage-50 text-sage-700 ${className}`} role="img" aria-label="Photo unavailable"><ImageOff size={28} aria-hidden="true" /></span>
  );
}

export default DesignPhoto;
