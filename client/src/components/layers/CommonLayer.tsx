import CommonFooter from "../common/footer/CommonFooter"
import CommonHeader from "../common/header/CommonHeader"

const CommonLayer = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <main>
        <CommonHeader/>
        {children}
        <CommonFooter/>
    </main>
    </>
  )
}

export default CommonLayer