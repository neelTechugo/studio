package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class AddFeedPostModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: AddFeedPostResult,
)

data class AddFeedPostResult(
    @SerializedName("posted_by_id")
    val postedById: String,
    @SerializedName("posted_by_name")
    val postedByName: String,
    @SerializedName("post_content")
    val postContent: String,
    val post: String,
    @SerializedName("user_mobile_number")
    val userMobileNumber: String,
    val like: Int,
    val dislike: Int,
    val heart: Int,
    val fire: Int,
    val laugh: Int,
    val clap: Int,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
    @SerializedName("_id")
    val id: String,
)