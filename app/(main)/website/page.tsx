import PublishButton, {
  LiveStatusAndUsername,
} from "@/components/buttons/PublishBtn";
import StatusBtn from "@/components/buttons/StatusBtn";
import DomainInputField from "@/components/DomainInputField";
import ResumePreview from "@/components/resume/ResumePreview";
import LinkIcon from "@/components/ui/link-icon";
import { getUserData } from "@/lib/supabase/user/getUserData";

export default async function WebSite() {
  const userdata: LiveStatusAndUsername = await getUserData([
    "username",
    "islive",
  ]);

  return (
    <div>
      <div className="flex mt-12 text-lg text-center flex-col justify-center items-center">
        <div className="md:w-[80vw] mx-4 max-[915px]:block p-4 rounded-lg border justify-between mb-4 flex items-center gap-2.5">
          <div className="flex gap-1.5 items-center max-[915px]:text-sm">
            <LinkIcon size={17} className="mt-1" />
            <div>wrkks.site&nbsp;/</div>
            <DomainInputField username={userdata?.username ?? ""} />
          </div>
          <div className="gap-2.5 flex justify-center tracking-wide max-[915px]:mt-4">
            <StatusBtn islive={userdata?.islive ?? false} />
            <PublishButton data={userdata} />
          </div>
        </div>
        <ResumePreview />
      </div>
    </div>
  );
}
