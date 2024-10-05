<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\AwardCategory;
use App\Models\Award;
use Illuminate\Support\Facades\Auth;
class AwardCategoryController extends Controller
{
    /**
     * Creates a new award category.
     * 
     * This endpoint validates the request data, creates a new award category and returns the created award category.
     * 
     * @author - Bansi
     * @param Request $request - The request object containing the name, description, status, award_id and main_sponsored_id
     * 
     * @return \Illuminate\Http\Response - A JSON response containing the created award category or an error message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'description' => 'required',
            'status' => 'required',
            'main_sponsored_id' => 'required',
        ]);

        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }

        $admin = Auth::guard('api')->user();
        $award = Award::find($admin->award_id);
        
        // Prepare questions with dynamic keys
        $questionsWithKeys = [];
        foreach ($request->question as $index => $question) {
            $questionsWithKeys["question-" . ($index + 1)] = $question; // Dynamic key
        }
        
        $credentials = json_encode($questionsWithKeys); // JSON-encoded questions
        $awardCategory = new AwardCategory();
        $awardCategory->name = $request->name;
        $awardCategory->description = $request->description;
        $awardCategory->status = $request->status;
        $awardCategory->award_id = $award->id;
        $awardCategory->main_sponsored_id = $request->main_sponsored_id;
        $awardCategory->credentials = $credentials;
        $awardCategory->save();

        $this->responseData['status'] = 'success';
        $this->responseData['message'] = "Award Category created successfully";
        $this->responseData['data'] = $awardCategory;
        return response()->json($this->responseData);
    }


    public function index()
    {
        $admin = Auth::guard('api')->user();
        $award = Award::find($admin->award_id);
        $awardCategories = AwardCategory::where('award_id', $admin->award_id)->get();
        foreach($awardCategories as $awardCategory)
        {
            if($awardCategory->award_id == $award->id)
            {
                $awardCategory->award_id = $award->name;
            }
            if($awardCategory->status == '1')
            {
                $awardCategory->status = 'Active';
            }
            else
            {
                $awardCategory->status = 'Inactive';
            }

            if($awardCategory->main_sponsored_id == '0')
            {
                $awardCategory->main_sponsored_id = 'Sponsor-1';
            }
            else
            {
                $awardCategory->main_sponsored_id = 'Sponsor-2';
            }
            $awardCategory->date = date('d-m-Y', strtotime($awardCategory->created_at));
        }
        if(isset($awardCategories))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award Categories";
            $this->responseData['data'] = $awardCategories;
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "No data found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function show($id)
    {
        $awardCategory = AwardCategory::find($id);

        if(isset($awardCategory))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award Category";
            $this->responseData['data'] = $awardCategory;
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "No data found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'description' => 'required',
            'status' => 'required',
            'main_sponsored_id' => 'required',
        ]);

        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }

        $awardCategory = AwardCategory::find($id);
        $admin = Auth::guard('api')->user();
        $award = Award::find($admin->award_id);
        if($awardCategory)
        {
            $awardCategory->name = $request->name;
            $awardCategory->description = $request->description;
            $awardCategory->status = $request->status;
            $awardCategory->award_id = $award->id;
            $awardCategory->main_sponsored_id = $request->main_sponsored_id;
            $awardCategory->save();

            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award Category updated successfully";
            $this->responseData['data'] = $awardCategory;
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "No data found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function destroy($id)
    {
        $awardCategory = AwardCategory::find($id);
        if($awardCategory)
        {
            $awardCategory->delete();
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award Category deleted successfully";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "Award Category not found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function multipleDelete(Request $request)
    {
        $awardCategories = $request->ids;
        if($awardCategories)
        {
            foreach($awardCategories as $id)
            {
                $awardCategory = AwardCategory::find($id);
                if($awardCategory)
                {
                    $awardCategory->delete();
                }
            }
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award Categories deleted successfully";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "Award Categories not found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }
}
