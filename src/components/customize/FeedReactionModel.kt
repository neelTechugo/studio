package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class FeedReactionModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: FeedReactionResult,
)

data class FeedReactionResult(
    @SerializedName("customer_id")
    val customerId: String,
    @SerializedName("post_id")
    val postId: String,
    val reaction: String,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
    @SerializedName("_id")
    val id: String,
)
