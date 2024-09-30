<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\AwardCategory;
class AwardCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'description' => 'required',
            'status' => 'required',
            'award_id' => 'required',
            'status' => 'required',
            'main_sponsor_id' => 'required',
        ]);

        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }

        $awardCategory = new AwardCategory();
        $awardCategory->name = $request->name;
        $awardCategory->description = $request->description;
        $awardCategory->status = $request->status;
        $awardCategory->award_id = $request->award_id;
        $awardCategory->main_sponsored_id = $request->main_sponsor_id;
        $awardCategory->save();

        $this->responseData['status'] = 'success';
        $this->responseData['message'] = "Award Category created successfully";
        $this->responseData['data'] = $awardCategory;
        return response()->json($this->responseData);
    }
}
