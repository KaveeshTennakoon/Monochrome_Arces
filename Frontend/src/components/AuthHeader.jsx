import Logo from "./Logo";

function AuthHeader() {
  return (
    <header className="flex flex-col items-center gap-3">
      <Logo width="50px" />
      <h1 className="text-xl font-semibold text-center">
        Registrar General's Deparment
      </h1>
    </header>
  );
}

export default AuthHeader;
