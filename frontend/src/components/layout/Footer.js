export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-6 text-sm text-gray-600 mt-12 border-t">
      <div className="container mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-700">ManageTheQueue</span>.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
