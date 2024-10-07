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
            'main_sponsored_id' => 'required',
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
        $awardCategory->main_sponsored_id = $request->main_sponsored_id;
        $awardCategory->save();

        $this->responseData['status'] = 'success';
        $this->responseData['message'] = "Award Category created successfully";
        $this->responseData['data'] = $awardCategory;
        return response()->json($this->responseData);
    }


    public function index()
    {
        $awardCategories = AwardCategory::all();
        foreach($awardCategories as $awardCategory)
        {
            if($awardCategory->status == '1')
            {
                $awardCategory->status = 'Active';
            }
            else
            {
                $awardCategory->status = 'Inactive';
            }
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

        echo '<pre>';
            print_r($request->all());
            echo '</pre>';
        exit();

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'description' => 'required',
            'status' => 'required',
            'award_id' => 'required',
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
        if($awardCategory)
        {
            $awardCategory->name = $request->name;
            $awardCategory->description = $request->description;
            $awardCategory->status = $request->status;
            $awardCategory->award_id = $request->award_id;
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
