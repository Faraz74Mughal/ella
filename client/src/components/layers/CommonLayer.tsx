import CommonFooter from "../common/footer/CommonFooter";
import CommonHeader from "../common/header/CommonHeader";

const CommonLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CommonHeader />
      <main className="min-h-[calc(100vh-136px)] bg-background">{children}</main>
      <CommonFooter />
    </>
  );
};

export default CommonLayer;
