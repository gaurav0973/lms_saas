import { getCompanion } from "@/lib/actions/companion.actions"
import { getSubjectColor } from "@/lib/utils"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import { redirect } from "next/navigation"
import { subjects } from '../../../constants/index';

interface CompanionSessionPageProps{
  params : Promise<{id : string}>
}


async function CompanionSession({params} : CompanionSessionPageProps) {
  
  const {id} = await params
  const companion = await getCompanion(id)
  const user = await currentUser()

  if(!user) redirect("/sign-in")
  if(!companion) redirect("/companions")



  return (
      <main>
        <article className="flex rounded-border justify-between p-6 max-md:flex-col">
          <div className="flex items-center gap-2">
                <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{backgroundColor : getSubjectColor(companion.subject)}}>
                    <Image src={`icons/${companion.subject}.svg`}
                      alt={companion.subject}
                      width={35} height={35}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                      
                    </div>

                </div>
          </div>
        </article>
      </main>
  )
}
export default CompanionSession