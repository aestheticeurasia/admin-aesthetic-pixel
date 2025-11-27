import AddNewUser from "@/app/components/CreateNewUser";

export default function AddUser() {
  return (
    <div className="py-5 px-4">
      <div className="flex justify-between items-center mb-10 md:mb-4">
        <span className="text-xl font-bold">Add New User</span>
      </div>
      <AddNewUser />
    </div>
  );
}
