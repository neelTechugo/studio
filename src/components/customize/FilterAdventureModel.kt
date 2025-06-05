package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class FilterAdventureModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: ArrayList<FilterAdventureResult>,
)

data class FilterAdventureResult(
    @SerializedName("_id")
    val id: String,
    val serviceType: String,
    val filterName: String,
    val filterValues: ArrayList<String>,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
)
