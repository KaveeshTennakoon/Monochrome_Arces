import {
  IdcardOutlined,
  KeyOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import AuthHeader from "../components/AuthHeader";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "../services/auth.service";
import { Link, useNavigate } from "react-router";

function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleCreateAccount = () => {
    mutate(formData);
  };

  return (
    <div className="py-10 px-5">
      <AuthHeader />
      <form className="flex flex-col gap-4 mt-6">
        <Input
          placeholder="Full Name"
          size="large"
          type="email"
          onChange={(e) => handleInputChange("name", e.target.value)}
          prefix={
            <UserOutlined
              style={{ color: "rgba(0,0,0,.25)" }}
              className="mr-2"
            />
          }
        />
        <Input
          placeholder="NIC Number"
          size="large"
          type="email"
          onChange={(e) => handleInputChange("nic", e.target.value)}
          prefix={
            <IdcardOutlined
              style={{ color: "rgba(0,0,0,.25)" }}
              className="mr-2"
            />
          }
        />
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
        <Input
          placeholder="Confirm Password"
          size="large"
          type="password"
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
          onClick={handleCreateAccount}
        >
          Creat Account
        </Button>
        <div className="text-gray-500">
          Already have an account? &nbsp;
          <Link
            to="/login"
            className="text-blue-600 underline underline-offset-4"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateAccount;
