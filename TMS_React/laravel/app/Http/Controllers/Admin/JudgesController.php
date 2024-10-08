<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Judges;
use App\Models\Award;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class JudgesController extends Controller
{

    public $modelObj;
    /**
     * Initialize the JudgesController with a new instance of the Judges model
     * 
     * author - Bansi
     */
    public function __construct()
    {
        $this->modelObj = new Judges();
        $this->moduleSlug = "judges";

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin = Auth::guard('api')->user();
        $award = Award::find($admin->award_id);
        $judges = $this->modelObj::where('award_id', $admin->award_id)->get();
        foreach($judges as $judge)
        {
            if($judge->award_id == $award->id)
            {
                $judge->award_id = $award->name;
            }
            if($judge->status == '1')
            {
                $judge->status = 'Active';
            }
            else
            {
                $judge->status = 'Inactive';
            }
            $judge->date = date('d-m-Y', strtotime($judge->created_at));

            $judge->image = $this->modelObj->getJudgesImage($judge->id, $judge->image) ;
        }
        if(isset($judges))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Judges list found successfully"; 
            $this->responseData['data'] = $judges;
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'post' => 'required',
            'description' => 'required',
            'status' => 'required',
            'is_chairman' => 'required',
        ]);

        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
        $admin = Auth::guard('api')->user();
        $award = Award::find($admin->award_id);
        $judge = new $this->modelObj;
        $judge->award_id = $award->id ?? 0;
        $judge->name = $request->name;
        $judge->post = $request->post;
        $judge->description = $request->description;
        $judge->status = $request->status;
        $judge->is_chairman = $request->is_chairman;
        $judge->save();

        if ($request->hasFile('image')) {

            $image = $request->file('image');
            $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
            $uploadPath = public_path('admin' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $this->moduleSlug . DIRECTORY_SEPARATOR . $judge->id);
        
            if (\File::exists($uploadPath)) {
                \File::delete($uploadPath);
            }
            $image->move($uploadPath, $filename);
            $judge->image = $filename;
            $judge->save();
        }

        $this->responseData['status'] = 'success';
        $this->responseData['message'] = "Judge created successfully";
        $this->responseData['data'] = $judge;
        return response()->json($this->responseData);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $judge = $this->modelObj::find($id);

        if(isset($judge))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Judge found successfully";
            $this->responseData['data'] = $judge;
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'post' => 'required',
            'description' => 'required',
            'status' => 'required',
            'is_chairman' => 'required',
        ]);

        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
        $admin = Auth::guard('api')->user();
        $award = Award::find($admin->award_id);
        $judge = $this->modelObj::find($id);

        if(isset($judge))
        { 
            $judge->award_id = $award->id ?? 0;
            $judge->name = $request->name;
            $judge->post = $request->post;
            $judge->description = $request->description;
            $judge->status = $request->status;
            $judge->is_chairman = $request->is_chairman;
            $judge->save();
        

            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Judge updated successfully";
            $this->responseData['data'] = $judge;
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "Judge not found";
            $this->responseData['data'] = [];
        }
        return response()->json($this->responseData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $judge = $this->modelObj::find($id);
        if($judge)
        {
            $judge->delete();
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Judge deleted successfully";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "Judge not found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }
}
