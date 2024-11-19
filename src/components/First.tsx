import dummy from "@/state/atoms/dummy"
import { useRecoilValue } from "recoil"

const First = () => {
  const dummys = useRecoilValue(dummy)
  return (

    <div>
      Hello
      <p>{dummys}</p>
    </div>
  )
}
export default First;