import {Router} from "express";
import {handleError} from '../utils';
import {ab_log} from "../utils/log";

function logStep(req, res, next){
    let experiment_id = req.params.experimentId,
        unique_member_id = req['cookies'] && req['cookies']['ab_'+experiment_id] ? Number(req['cookies']['ab_'+experiment_id]) : null,
        step = req.params.step,
        version = (unique_member_id % 2), // 0 is the baseline version
        device_type;
    if(req.headers["user-agent"] !== "node-superagent/1.8.3"){
        let userAgent = req.headers["user-agent"], isMobile, isTablet;
        isMobile = (userAgent.match(/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|NetFront|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/) ? true : false)  && !userAgent.match(/Tablet|iPad|Nexus 7/) ,
            isTablet = (userAgent.match(/iPad|Android|Kindle|Silk-Accelerated|Tablet/) ? true : false) && !userAgent.match(/Android.*Mobile/);
        device_type = !(isMobile || isTablet) ? 0 : isMobile ? 1 : 2; //0 = desktop, 1 = mobile, 2 = tablet
    }
    if(unique_member_id){
        ab_log(unique_member_id, experiment_id, version, step, device_type);
    }
    res.status(200).end();
}

const router = Router();

router.get("/:experimentId/:step", logStep);
router.use(handleError);

export default router;
