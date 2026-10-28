//libraries
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

//components
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import DesignPhoto from "./DesignPhoto";

function DesignImageGallery({ images, title }) {
  const [carouselRef, carouselApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return undefined;
    const updateSelectedPhoto = () => setSelectedIndex(carouselApi.selectedScrollSnap());
    updateSelectedPhoto();
    carouselApi.on("select", updateSelectedPhoto).on("reInit", updateSelectedPhoto);
    return () => {
      carouselApi.off("select", updateSelectedPhoto).off("reInit", updateSelectedPhoto);
    };
  }, [carouselApi]);

  const navigateDesignPhotos = (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); carouselApi?.scrollPrev(); }
    if (event.key === "ArrowRight") { event.preventDefault(); carouselApi?.scrollNext(); }
  };

  if (!images.length) return <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-2xl bg-sage-50 text-sage-700"><ImageOff size={36} aria-hidden="true" /><p>No photos available.</p></div>;

  return (
    <section aria-label="Design photo gallery" aria-roledescription="carousel" tabIndex={0} onKeyDown={navigateDesignPhotos} className="min-w-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-700">
      <div className="relative overflow-hidden rounded-2xl border border-sage-200/60 bg-sage-50">
        <div ref={carouselRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((image, index) => <div key={image.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}`} aria-hidden={index !== selectedIndex} className="min-w-0 flex-[0_0_100%]">
              <DesignPhoto key={image.url} image={image} alt={`${title} — ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} className="aspect-[16/10] w-full object-contain" />
            </div>)}
          </div>
        </div>
        {images.length > 1 && <>
          <button type="button" onClick={() => carouselApi?.scrollPrev()} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-sage-200 bg-white/95 p-2 text-sage-700 shadow-sm hover:bg-white"><ChevronLeft size={22} aria-hidden="true" /></button>
          <button type="button" onClick={() => carouselApi?.scrollNext()} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-sage-200 bg-white/95 p-2 text-sage-700 shadow-sm hover:bg-white"><ChevronRight size={22} aria-hidden="true" /></button>
        </>}
        <p aria-live="polite" aria-atomic="true" className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white">Photo {selectedIndex + 1} of {images.length}</p>
      </div>
      {images.length > 1 && <div aria-label="Choose a design photo" className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => <button key={image.id} type="button" onClick={() => carouselApi?.scrollTo(index)} aria-label={`Show photo ${index + 1}`} aria-pressed={selectedIndex === index} className={`shrink-0 overflow-hidden rounded-xl border-2 p-0.5 ${selectedIndex === index ? "border-sage-700" : "border-transparent hover:border-sage-200"}`}>
          <DesignPhoto key={image.url} image={image} alt="" className="h-16 w-24 rounded-lg object-cover" />
        </button>)}
      </div>}
    </section>
  );
}

export default DesignImageGallery;
