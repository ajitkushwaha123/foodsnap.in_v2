import { getUserId, updateCredits } from "@/helpers/auth";
import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await dbConnect();

    const { userId } = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query")?.trim();
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "16", 10), 1),
      16
    );
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const filters = { approved: false };
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const premium = searchParams.get("premium");

    if (category) filters.category = category;
    if (region) filters.region = region;
    if (premium === "true") filters.premium = true;

    const creditUpdate = await updateCredits(userId, 1);
    if (!creditUpdate.success) {
      return NextResponse.json(
        { error: creditUpdate.message },
        { status: 402 }
      );
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { searchHistory: { query } },
        $push: {
          searchHistory: {
            $each: [{ query, timestamp: new Date() }],
            $position: 0,
            $slice: 5,
          },
        },
        $inc: { totalSearches: 1 },
      },
      { new: true }
    );

    const searchPipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                autocomplete: {
                  query,
                  path: "title",
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                  score: { boost: { value: 3 } },
                },
              },
              {
                text: {
                  query,
                  path: ["manual_tags", "auto_tags"],
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                  score: { boost: { value: 2 } },
                },
              },
              {
                autocomplete: {
                  query,
                  path: "cuisine",
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                  score: { boost: { value: 1.5 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $match: filters },
      { $addFields: { score: { $meta: "searchScore" } } },
      { $sort: { score: -1, quality_score: -1, likes: -1 } },
      {
        $facet: {
          paginatedResults: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                title: 1,
                manual_tags: 1,
                auto_tags: 1,
                cuisine: 1,
                image_url: 1,
                category: 1,
                region: 1,
                quality_score: 1,
                likes: 1,
                score: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const [aggregationResult] = await Image.aggregate(searchPipeline);

    const results = aggregationResult?.paginatedResults || [];
    const total = aggregationResult?.totalCount?.[0]?.count || 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    console.log("[SEARCH_RESULTS]", results);
    console.log("[SEARCH_TOTAL]", total);
    console.log("[SEARCH_TOTAL_PAGES]", totalPages);

    return NextResponse.json(
      {
        data: results,
        pagination: {
          page,
          totalPages,
          total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
        credits: creditUpdate.credits,
        message: "Search completed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SEARCH_ERROR]", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
};

