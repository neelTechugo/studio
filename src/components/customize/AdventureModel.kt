package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class AdventureModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: ArrayList<AdventureResult>,
)

data class AdventureResult(
    @SerializedName("_id")
    val id: String,
    val serviceName: String,
    val serviceType: String,
    val vendorName: String,
    val filters: List<AdventureFilter>,
    val mobileNumber: String?,
    val vendorId: AdventureVendorId,
    val city: String,
    val priceForOne: Long?,
    val details: AdventureDetails,
    val reviews: List<Any?>,
    val menuImages: List<Any?>,
    val photos: List<String>,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
    @SerializedName("is_block")
    val isBlock: Boolean,
    @SerializedName("is_saved")
    val isSaved: Boolean,
    val distance: AdventureDistance,
)

data class AdventureFilter(
    @SerializedName("_id")
    val id: String,
    val filterName: String,
)

data class AdventureVendorId(
    @SerializedName("_id")
    val id: String,
    @SerializedName("purchased_plan_price")
    val purchasedPlanPrice: Int,
)

data class AdventureDetails(
    val duration: String,
    val highlights: String,
    val includes: String,
    val importantInfo: String,
    val photos: List<Any?>?,
    val aboutAdventure: String,
    val address: AdventureAddress,
    val searchTags: List<String>,
)

data class AdventureAddress(
    val lat: Double,
    val long: Double,
)

data class AdventureDistance(
    val text: String,
    val value: Int,
)

