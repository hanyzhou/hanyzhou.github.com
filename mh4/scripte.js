var module = angular.module('app.mp4', []);
var skills = skills || [];
var equipes = equipes || [];
var decos = decos || [];
var stones = stones || [];
module.factory('mh4Statics',['$q','$log', function($q,$log){
	var m = {};
	m.skills = skills || [];
	m.equipes = equipes || [];
	m.decos = decos || [];
	m.stones = stones || [];
//---------------------------------------------------------
//	Tool Finction
	m.getCombinAryByNum = function (arr, num){
	    var r=[];
	    (function f(t,a,n){
	        if (n===0) return r.push(t);
	            for (var i=0,l=a.length; i<=l-n; i++){
	                f(t.concat(a[i]), a.slice(i+1), n-1);
	            }
	        })([],arr,num);
	    return r;
	};
	m.computeList = function(equipe,decos){
		var res = [];
		var slot = Number(equipe.slot);
		res.push({part : equipe, decos : []});
		if(slot === 0) return res;
		var decosCaseOne = decos.filter(function(d){return Number(d.slot) === 1;});
		if(slot === 1){
			for(var i=0;i<decosCaseOne.length;i++){
				res.push({part : equipe, decos : [decosCaseOne[i]]});
			}
			return res;
		}
		var decosCaseTwo = decos.filter(function(d){return Number(d.slot) === 2;});
		if(slot === 2){
			for(var j=0;j<decosCaseOne.length;j++){
				res.push({part : equipe, decos : [decosCaseOne[j],decosCaseOne[j]]});
				if(j<decosCaseOne.length/2){
					res.push({part : equipe, decos : [decosCaseOne[j],decosCaseOne[decosCaseOne.length-j-1]]});
				}
			}
			for(var k=0;k<decosCaseTwo.length;k++){
				res.push({part : equipe, decos : [decosCaseTwo[k]]});
			}
			return res;
		}
		var decosCaseThr = decos.filter(function(d){return Number(d.slot) === 3;});
		if(slot === 3){
			var combindecosone = m.getCombinAryByNum(decosCaseOne,3);
			for(var a=0;a<decosCaseOne.length;a++){
				res.push({part : equipe, decos : [decosCaseOne[a],decosCaseOne[a],decosCaseOne[a]]});
			}
			for(var b=0;b<combindecosone.length;b++){
				res.push({part : equipe, decos : combindecosone[b]});
			}
			for(var c=0;c<decosCaseTwo.length;c++){
				for(var d=0;d<decosCaseOne.length;d++){
					res.push({part : equipe, decos : [decosCaseOne[d],decosCaseTwo[c]]});
				}
			}
			for(var e=0;e<decosCaseThr.length;e++){
				res.push({part : equipe, decos : [decosCaseThr[e]]});
			}
			return res;
		}
	};
	m.getClass = function(obj,skillList){
		var classify = 0;
		for(var i=0; i<skillList.length; i++){
			var type = skillList[i].type;
			var value = Number(skillList[i].value);
			for(var k in obj){
				var skill = obj[k].part.skill;
				for(var a=0;a<skill.length;a++){
					if(type === skill[a].name){
						value-=Number(skill[a].value);
					}
				}
				var decoList = obj[k].decos;
				for(var b=0;b<decoList.length;b++){
					var decoSkill = decoList[b].positive;
					if(decoSkill.name === type){
						value-=Number(decoSkill.value);
					}
				}
			}
			if(value>0) classify++;
		}
		return classify;
	};
//---------------------------------------------------------
//	Use Finction
	m.returnfunction = function(returndata){
		var res = {};
		res.then = function(cb) { 
			return cb(returndata); 
		};
		return res;
	};
	m.typeList = function(query){
		var nameList = [];
		var objList = [];
		for(var i=0;i<skills.length;i++) {
			var skill = skills[i];
			if(query.indexOf(skill.name) !== -1){
				nameList.push(skill.type);
				objList.push(skill);
			}
		}
		return m.returnfunction({skillNames : nameList, skillObj : objList});
	};


	m.groupEquipes = function(obj){
		var equipesObj = obj.equipefilter;
		var res = {skillList : obj.skillList, group : {}};
		for(var k in equipesObj){
			res.group[k] = [];
			for(var i=0;i<equipesObj[k].length;i++){
				var array = m.computeList(equipesObj[k][i],obj.decos);
				res.group[k] = res.group[k].concat(array);
			}
		}
		return m.returnfunction(res);
	};

	m.getModulDecos = function(classifyobj,decos){
		for(var k in classifyobj.skillval){
			if(classifyobj.skillval[k]>0){
				return {ok : false};
			}
		}
		return {ok : true};
	};

	
	m.classifyExhaustive = function(data){
		var obj = data.group;
		var res = [];
		var nb=0;
		for(var a=0;a<obj.head.length;a++){
			for(var b=0;b<obj.body.length;b++){
				for(var c=0;c<obj.arm.length;c++){
					for(var d=0;d<obj.waist.length;d++){
						for(var e=0;e<obj.leg.length;e++){
							var node = {head : obj.head[a], body : obj.body[b], arm : obj.arm[c], waist : obj.waist[d], leg : obj.leg[e]};
							var objclass = m.getClass(node,data.skillList);
							node.classify = objclass;
							if(objclass===0){
								res.push(node);
							}
						}
					}
				}
			}
		}
		return m.returnfunction(res);
	};

	
	m.computeskillobj = function(s,o){
		var res = { skillval : {}, valuereturn: 0 };
		res.one = 0; res.two=0; res.thr=0;
		for(var k in o){
			var skillss = o[k].skill;
			for(var i=0;i<skillss.length;i++){
				var skill = skillss[i];
				if(s[skill.name]){
					if(!res.skillval[skill.name]) res.skillval[skill.name] = s[skill.name];
					res.skillval[skill.name] -= Number(skill.value);
				}
			}
			if(o[k].slot === "1"){res.one++;}
			if(o[k].slot === "2"){res.two++;}
			if(o[k].slot === "3"){res.thr++;}
		}
		for(var n in s){
			res.valuereturn += res.skillval[n];
		}
		return res;
	};
	m.computeskillUnit = function(s,o){
		var res = { skillval : s.skillval };
		res.valuereturn = 0 ;
		res.one = s.one || 0; res.two=s.two || 0; res.thr=s.thr || 0;
		var skillss = o.skill;
		for(var i=0;i<skillss.length;i++){
			var skill = skillss[i];
			if(s.skillval[skill.name]){
				//if(!res.skillval[skill.name]) res.skillval[skill.name] = s[skill.name];
				res.skillval[skill.name] -= Number(skill.value);
			}
		}
		if(o.slot === "1"){res.one++;}
		if(o.slot === "2"){res.two++;}
		if(o.slot === "3"){res.thr++;}
		for(var n in s.skillval){
			res.valuereturn += res.skillval[n];
		}
		return res;
	};
	//------------------------------------------------------------------------------------
	m.filterEquipe = function(skillList){
		var skillnames = skillList.map(function(f){return f.type;});
		var res = {skillList : skillList, equipefilter : {} };
		for(var k in equipes){
			var equipe = equipes[k];
			res.equipefilter[k] = [];
			for(var i=0; i<equipe.length; i++){	
				var skill = equipe[i].skill;
				for(var j=0;j<skill.length;j++){
					if(Number(skill[j].value)>0 && (skillnames.indexOf(skill[j].name) !== -1)){
						res.equipefilter[k].push(equipe[i]);
						break;
					}
				}
			}
		}
		//log.equipefilter = angular.toJson(res.equiefilter);
		res.decos = [];
		for(var a=0;a<decos.length;a++){
			if( skillnames.indexOf(decos[a].positive.name) !== -1 ){
				res.decos.push(decos[a]);
			}
		}
		//log.decos = angular.toJson(res.decos);
		return $q.when(res);
	};
	
	var isGood = function(o,s){
		var sum = {};
		for(var k in o){
			var os = o[k].skill;
			for(var j=0;j<os.length;j++){
				if(os[j].name !==''){
					if(!sum[os[j].name]) sum[os[j].name] = 0;
					sum[os[j].name] += Number(os[j].value);
				}
			}
		}
		for(var i=0;i<s.length;i++){
			if(!sum[s[i].type] || sum[s[i].type]<Number(s[i].value)){
				return false;
			}
		}
		return true;
	};
	var getModelDecos =function(o,d,s){
		return {ok : false};
	};
	var getAllGroupGood = function(group,kl,ki,ol,dc,sl){
		if(isGood(group,sl)){ 
			return [$q.when(angular.copy(group))];
		} else if(ki >= kl.length){
			var decomod = getModelDecos(group,dc,sl);
			if(decomod.ok){
				group.decos = decomod.result;
				return [$q.when(angular.copy(group))];
			}
			return null;
		} else {
			var res = [];
			var k = kl[ki];
			for(var i=0;i<ol[k].length;i++){
				group[k] = ol[k][i];
				res = res.concat(getAllGroupGood(group,kl,ki+1,ol,dc,sl)).filter(function(d){return d!==null;});
			}
			return res;
		}
	};
	m.classifyEquipe = function(fq,log){
		fq.then(function(data){
			var res = [];
			var ol = data.equipefilter;
			var dc = data.decos;
			var sl = data.skillList;
			res = getAllGroupGood({},['head','body','arm','waist','leg'],0,ol,dc,sl);
	//		for(var a=0;a<ol.head.length;a++){
	//			var node = { head : ol.head[a] };
	//			if(isGood(node,sl)){ res.push(node); continue;}
	//			for(var b=0;b<ol.body.length;b++){
	//				node.body =ol.body[b];
	//				if(isGood(node,sl)){ res.push(node); continue;}
	//				for(var c=0;c<ol.arm.length;c++){
	//					node.arm = ol.arm[c];
	//					if(isGood(node,sl)){ res.push(node); continue;}
	//					for(var d=0;d<ol.waist.length;d++){
	//						node.waist = ol.waist[d];
	//						if(isGood(node,sl)){ res.push(node); continue;}
	//						for(var e=0;e<ol.leg.length;e++){
	//							node.leg = ol.leg[e];
	//							if(isGood(node,sl)){ res.push(node); continue;}
	//							else {
	//								var decomod = getModelDecos(node,dc,sl);
	//								if(decomod.ok){
	//									node.decos = decomod.result;
	//									res.push(node);
	//								}
	//							}
	//						}
	//					}
	//				}
	//			}
	//		}
			return $q.all(res);
		});
	};
		
	return m;
}]);
module.controller('equipeComputer',['$scope','mh4Statics',function($scope,mh4Statics) {
	$scope.allSkills = mh4Statics.skills;
	$scope.w-+antSkills = $scope.wantSkills || [];
	$scope.newTag = null;
	$scope.$watch("newTag",function(){	if($scope.newTag){$scope.wantSkills.push($scope.newTag) ;} });	
	$scope.$watch(function(){return angular.toJson($scope.wantSkills);},function(){	$scope.newTag = null; });
	$scope.deleteSkill=function(index){
		$scope.wantSkills.splice(index,1);
	};
	$scope.loading = { etape : 0 };
	$scope.computer = function(){
		$scope.loading.message="computer start";	
		mh4Statics.classifyEquipe(mh4Statics.filterEquipe($scope.wantSkills))
		.then(function(result){
			$scope.result = result.filter(function(d){return d!==null;}).map(function(r){
				return { 
					head:	r.head? { name : r.head.name , skill : r.head.skill} : {},
					body:	r.body? { name : r.body.name , skill : r.body.skill} : {},
					arm:	r.arm? { name : r.arm.name , skill : r.arm.skill} : {},
					waist:	r.waist? { name : r.waist.name , skill : r.waist.skill} : {},
					leg:	r.leg? { name : r.leg.name , skill : r.leg.skill} : {},
					decos:	r.decos? { name : r.decos.name , skill : r.decos.skill} : {}
				};
			});
		});
	};
}]);