package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class CMSModel(
val statusCode: Int,
val status: Boolean,
val message: String,
val result: CMSResult,
)

data class CMSResult(
    @SerializedName("_id")
    val id: String,
    val policyType: String,
    val content: String,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
)
