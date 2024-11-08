"use client"
import Link from "next/link";

const Pagination = ({ prevLink, nextLink }) => {
  return (
    <div className="mt-6 flex justify-between">
      {prevLink ? (
        <Link href={prevLink}>
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            Previous
          </button>
        </Link>
      ) : (
        <span />
      )}
      {nextLink ? (
        <Link href={nextLink}>
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            Next
          </button>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
};

export default Pagination;
