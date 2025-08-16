import { KeyOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { Link, useNavigate } from "react-router";
import AuthHeader from "../components/AuthHeader";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // TODO:
  const { mutate, isPending, isError } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleLogin = async () => {
    mutate(formData);
  };

  return (
    <div className="py-10 px-5">
      <AuthHeader />
      <form className="flex flex-col gap-4 mt-6">
        <Input
          placeholder="Email Adddress"
          size="large"
          type="email"
          onChange={(e) => handleInputChange("email", e.target.value)}
          prefix={
            <MailOutlined
              style={{ color: "rgba(0,0,0,.25)" }}
              className="mr-2"
            />
          }
        />
        <Input
          placeholder="Password"
          size="large"
          type="password"
          onChange={(e) => handleInputChange("password", e.target.value)}
          prefix={
            <KeyOutlined
              style={{ color: "rgba(0,0,0,.25)" }}
              className="mr-2"
            />
          }
        />
        <Button
          color="default"
          variant="solid"
          size="large"
          className="w-full mt-2"
          iconPosition="end"
          loading={isPending || isError}
          onClick={handleLogin}
        >
          Sign In
        </Button>
        <div className="text-gray-500">
          Don't have an account? &nbsp;
          <Link
            to="/signup"
            className="text-blue-600 underline underline-offset-4"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
