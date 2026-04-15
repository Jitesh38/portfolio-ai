import InfoDialog from "@/components/buttons/InfoBtn";
import FileUpload from "@/components/FileUpload";

export default function Upload() {
  return (
    <div>
      <div className="flex mt-20 text-lg text-center flex-col justify-center items-center">
        <div className="mb-4">
          Upload a PDF of your LinkedIn or your resume <br /> and generate your
          personal site
        </div>
        <InfoDialog gifUrl="/linkedin.gif" />

        <FileUpload />
      </div>
    </div>
  );
}
