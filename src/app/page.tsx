import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-red-500">Welcome to FSW Donalds</h1>
      <p>Your favorite fast food restaurant</p>
      <Input placeholder="Search for food..." className="mb-4" />
      <Button variant={"default"}>Order Now</Button>
    </div>
  );
}
 
export default HomePage;