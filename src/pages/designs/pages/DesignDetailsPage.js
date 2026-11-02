//libraries
import { useParams } from "react-router-dom";

//components
import DesignDetails from "../components/details/DesignDetails";

function DesignDetailsPage() {
  const { designId } = useParams();
  return <DesignDetails key={designId} designId={designId} />;
}

export default DesignDetailsPage;
