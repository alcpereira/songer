import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSongResults } from "~/.server/db/songs";
import { getUserSession } from "~/.server/services/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserSession(request);

  if (!user) {
    throw redirect("/login");
  }

  if (user.permission !== "admin") {
    throw redirect("/");
  }

  return await getSongResults();
}

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2 text-white">
                ID
              </th>
              <th className="border border-gray-700 px-4 py-2 text-white">
                Title
              </th>
              <th className="border border-gray-700 px-4 py-2 text-white">
                🤮 -2
              </th>
              <th className="border border-gray-700 px-4 py-2 text-white">
                🤢 -1
              </th>
              <th className="border border-gray-700 px-4 py-2 text-white">
                😐 0
              </th>
              <th className="border border-gray-700 px-4 py-2 text-white">
                😁 1
              </th>
              <th className="border border-gray-700 px-4 py-2 text-white">
                😍 2
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((song) => (
                <tr key={song.id} className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-2 text-center text-white">
                    {song.id}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-white">
                    {song.title}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-center text-white">
                    {song.votes["-2"]}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-center text-white">
                    {song.votes["-1"]}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-center text-white">
                    {song.votes["0"]}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-center text-white">
                    {song.votes["1"]}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-center text-white">
                    {song.votes["2"]}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
