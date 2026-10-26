import { ShieldCheck } from "lucide-react";
//TODO: this should be the "loading" page after the API is called, but before the API responds.
//TODO: this should just be a loading circle 

export default function Processing() {
  return (
    <div className="mx-auto max-w-[1120px] px-7 pt-[30px] pb-5 max-[850px]:px-4 max-[850px]:py-[25px] max-[620px]:px-[10px] max-[620px]:py-[18px]">
      <div className="my-[14px] flex items-center justify-center gap-[5px] text-[11px] text-[#b4bbb5]">
        <ShieldCheck size={12} /> AI can make mistakes. Review findings before
        making changes.
      </div>
    </div>
  );
}
